import Matter from "matter-js"
import {shallowRef} from "vue";
import PhysicsHelper from "@/utils/PhysicsHelper";
import decomp from 'poly-decomp';

const Engine = Matter.Engine,
    Common = Matter.Common,
    Runner = Matter.Runner,
    Events = Matter.Events,
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    Composite = Matter.Composite;
Common.setDecomp(decomp);

class PhysicsWorker {
    constructor() {
        this.engine = shallowRef(Engine.create());
        this.runner = shallowRef(Runner.create());
        this.bodies = [];
        this.walls = [];
    }

    Initialize(width, height, skills, useGravity = true) {
        this.SetWalls(width, height);
        if (!useGravity)
            this.engine.value.world.gravity.y = 0;
        this.skills = skills.map(skill => {
            skill.body = this.getSvgBody(skill.point, skill.vertices);
            return skill;
        });
        this.Start();
        this.usedSkills = [];
    }

    SetWalls(width, height) {
        this.width = width;
        this.height = height;
        // Create a wall for the shapes to bounce off
        const wallOptions = {
            isStatic: true,
            render: {
                visible: true
            }
        }

        const ground = shallowRef(Bodies.rectangle(width / 2, height + 50, width + 100, 100, wallOptions));
        const ceiling = shallowRef(Bodies.rectangle(width / 2, -50, width + 100, 100, wallOptions));
        const leftWall = shallowRef(Bodies.rectangle(-50, height / 2, 100, height + 100, wallOptions));
        const rightWall = shallowRef(Bodies.rectangle(width + 50, height / 2, 100, height + 100, wallOptions));
        this.walls = [ground, ceiling, leftWall, rightWall];

        Composite.add(this.engine.value.world, [ground.value, ceiling.value, leftWall.value, rightWall.value]);
    }

    SetSkills(isMobile, width) {
        const points = [
            PhysicsHelper.GetRandomPosition(width),
            PhysicsHelper.GetRandomPosition(width),
            PhysicsHelper.GetRandomPosition(width),
            PhysicsHelper.GetRandomPosition(width),
            PhysicsHelper.GetRandomPosition(width),
            PhysicsHelper.GetRandomPosition(width)
        ];
        const svgs = {
            nodejs: `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 32 32" preserveAspectRatio="xMidYMid" fill="#8cc84b"><path d="M14.656.427c.8-.453 1.82-.455 2.6 0L29.2 7.16c.747.42 1.247 1.253 1.24 2.114v13.5c.005.897-.544 1.748-1.332 2.16l-11.88 6.702a2.6 2.6 0 0 1-2.639-.073l-3.565-2.06c-.243-.145-.516-.26-.688-.495.152-.204.422-.23.642-.32.496-.158.95-.4 1.406-.656.115-.08.256-.05.366.022l3.04 1.758c.217.125.437-.04.623-.145l11.665-6.583c.144-.07.224-.222.212-.38V9.334c.016-.18-.087-.344-.25-.417L16.19 2.244a.41.41 0 0 0-.465-.001L3.892 8.93c-.16.073-.27.235-.25.415v13.37c-.014.158.07.307.215.375l3.162 1.785c.594.32 1.323.5 1.977.265a1.5 1.5 0 0 0 .971-1.409l.003-13.29c-.014-.197.172-.36.363-.34h1.52c.2-.005.357.207.33.405L12.18 23.88c.001 1.188-.487 2.48-1.586 3.063-1.354.7-3.028.553-4.366-.12l-3.4-1.88c-.8-.4-1.337-1.264-1.332-2.16v-13.5a2.46 2.46 0 0 1 1.282-2.141L14.656.427zM18.1 9.785c1.727-.1 3.576-.066 5.13.785 1.203.652 1.87 2.02 1.892 3.358-.034.18-.222.28-.394.267-.5-.001-1.002.007-1.504-.003-.213.008-.336-.188-.363-.376-.144-.64-.493-1.273-1.095-1.582-.924-.463-1.996-.44-3.004-.43-.736.04-1.527.103-2.15.535-.48.328-.624 1-.453 1.522.16.383.603.506.964.62 2.082.544 4.287.5 6.33 1.207.845.292 1.672.86 1.962 1.745.378 1.186.213 2.604-.63 3.556-.684.784-1.68 1.2-2.675 1.442-1.323.295-2.695.302-4.038.17-1.263-.144-2.577-.476-3.552-1.336-.834-.724-1.24-1.852-1.2-2.94.01-.184.193-.312.37-.297h1.5c.202-.014.35.16.36.35.093.6.322 1.25.854 1.6 1.026.662 2.313.616 3.487.635.973-.043 2.065-.056 2.86-.7.42-.367.543-.98.43-1.508-.123-.446-.6-.653-1-.8-2.055-.65-4.285-.414-6.32-1.15-.826-.292-1.625-.844-1.942-1.693-.443-1.2-.24-2.687.693-3.607.9-.915 2.22-1.268 3.47-1.394z"/></svg>`,
            csharp: `<svg height="2500" preserveAspectRatio="xMidYMid" viewBox="0 -1.428 255.582 290.108" width="2222"     xmlns="http://www.w3.org/2000/svg">    <path d="m255.569 84.452c-.002-4.83-1.035-9.098-3.124-12.76-2.052-3.603-5.125-6.622-9.247-9.009-34.025-19.619-68.083-39.178-102.097-58.817-9.17-5.294-18.061-5.1-27.163.27-13.543 7.986-81.348 46.833-101.553 58.536-8.321 4.818-12.37 12.19-12.372 21.771-.013 39.455 0 78.91-.013 118.365 0 4.724.991 8.91 2.988 12.517 2.053 3.711 5.169 6.813 9.386 9.254 20.206 11.703 88.02 50.547 101.56 58.536 9.106 5.373 17.997 5.565 27.17.27 34.015-19.64 68.075-39.199 102.105-58.818 4.217-2.44 7.333-5.544 9.386-9.252 1.994-3.608 2.987-7.793 2.987-12.518 0 0 0-78.889-.013-118.345"          fill="#a179dc"/>    <path d="m128.182 143.241-125.194 72.084c2.053 3.711 5.169 6.813 9.386 9.254 20.206 11.703 88.02 50.547 101.56 58.536 9.106 5.373 17.997 5.565 27.17.27 34.015-19.64 68.075-39.199 102.105-58.818 4.217-2.44 7.333-5.544 9.386-9.252z"          fill="#280068"/>    <path d="m255.569 84.452c-.002-4.83-1.035-9.098-3.124-12.76l-124.263 71.55 124.413 72.073c1.994-3.608 2.985-7.793 2.987-12.518 0 0 0-78.889-.013-118.345"          fill="#390091"/>    <g fill="#fff">        <path d="m201.892 116.294v13.474h13.474v-13.474h6.737v13.474h13.474v6.737h-13.474v13.473h13.474v6.737h-13.474v13.474h-6.737v-13.474h-13.474v13.474h-6.737v-13.474h-13.473v-6.737h13.473v-13.473h-13.473v-6.737h13.473v-13.474zm13.474 20.21h-13.474v13.474h13.474z"/>        <path d="m128.457 48.626c35.144 0 65.827 19.086 82.262 47.456l-.16-.273-41.35 23.808c-8.146-13.793-23.08-23.102-40.213-23.294l-.54-.003c-26.125 0-47.305 21.18-47.305 47.305a47.08 47.08 0 0 0 6.239 23.47c8.154 14.235 23.483 23.836 41.067 23.836 17.693 0 33.109-9.723 41.221-24.11l-.197.345 41.287 23.918c-16.255 28.13-46.518 47.157-81.253 47.536l-1.058.006c-35.255 0-66.025-19.204-82.419-47.724-8.003-13.923-12.582-30.064-12.582-47.277 0-52.466 42.532-95 95-95z"/>    </g></svg>`,
            mysql: `<svg width="2500" height="2461" viewBox="0 0 256 252" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet"><path d="M235.648 194.212c-13.918-.347-24.705 1.045-33.752 4.872-2.61 1.043-6.786 1.044-7.134 4.35 1.392 1.392 1.566 3.654 2.784 5.567 2.09 3.479 5.741 8.177 9.047 10.614 3.653 2.783 7.308 5.566 11.134 8.002 6.786 4.176 14.442 6.611 21.053 10.787 3.829 2.434 7.654 5.568 11.482 8.177 1.914 1.39 3.131 3.654 5.568 4.523v-.521c-1.219-1.567-1.567-3.828-2.784-5.568-1.738-1.74-3.48-3.306-5.22-5.046-5.045-6.784-11.308-12.7-18.093-17.571-5.567-3.828-17.747-9.047-20.008-15.485 0 0-.175-.173-.348-.347 3.827-.348 8.35-1.74 12.005-2.784 5.915-1.567 11.308-1.218 17.398-2.784 2.783-.696 5.567-1.566 8.35-2.436v-1.565c-3.13-3.132-5.392-7.307-8.698-10.265-8.873-7.657-18.617-15.137-28.707-21.4-5.394-3.48-12.354-5.742-18.095-8.699-2.086-1.045-5.567-1.566-6.784-3.306-3.133-3.827-4.873-8.872-7.134-13.396-5.044-9.57-9.917-20.182-14.267-30.272-3.13-6.786-5.044-13.572-8.872-19.834-17.92-29.577-37.406-47.497-67.33-65.07-6.438-3.653-14.093-5.219-22.27-7.132-4.348-.175-8.699-.522-13.048-.697-2.784-1.218-5.568-4.523-8.004-6.089C34.006 4.573 8.429-8.996 1.122 8.924c-4.698 11.308 6.96 22.442 10.96 28.185 2.96 4.001 6.786 8.524 8.874 13.048 1.218 2.956 1.565 6.09 2.783 9.221 2.785 7.653 5.393 16.18 9.048 23.314 1.914 3.653 4.001 7.48 6.437 10.786 1.392 1.913 3.827 2.784 4.35 5.915-2.435 3.48-2.61 8.7-4.003 13.049-6.263 19.66-3.826 44.017 5.046 58.457 2.783 4.348 9.395 13.92 18.268 10.265 7.83-3.131 6.09-13.048 8.35-21.747.524-2.09.176-3.48 1.219-4.872v.349c2.436 4.87 4.871 9.569 7.133 14.44 5.394 8.524 14.788 17.398 22.617 23.314 4.177 3.13 7.482 8.524 12.702 10.438v-.523h-.349c-1.044-1.566-2.61-2.261-4.001-3.48-3.131-3.13-6.612-6.958-9.047-10.438-7.306-9.744-13.745-20.53-19.486-31.665-2.783-5.392-5.22-11.308-7.481-16.701-1.045-2.09-1.045-5.22-2.784-6.263-2.61 3.827-6.437 7.133-8.351 11.83-3.304 7.481-3.653 16.702-4.871 26.27-.696.176-.349 0-.697.35-5.566-1.394-7.48-7.134-9.569-12.006-5.22-12.352-6.09-32.186-1.565-46.452 1.218-3.654 6.438-15.136 4.35-18.616-1.044-3.306-4.525-5.22-6.438-7.829-2.261-3.306-4.698-7.48-6.263-11.135-4.176-9.743-6.264-20.53-10.787-30.273-2.088-4.524-5.74-9.22-8.699-13.396-3.305-4.697-6.959-8.004-9.569-13.571-.869-1.913-2.088-5.045-.696-7.133.348-1.392 1.043-1.913 2.436-2.261 2.262-1.915 8.7.521 10.96 1.565 6.438 2.608 11.831 5.046 17.225 8.699 2.435 1.74 5.045 5.046 8.176 5.916h3.654c5.568 1.217 11.83.348 17.05 1.913 9.222 2.957 17.572 7.307 25.054 12.005 22.792 14.44 41.58 34.97 54.282 59.501 2.088 4 2.957 7.656 4.871 11.83 3.655 8.526 8.178 17.225 11.83 25.576 3.654 8.176 7.133 16.528 12.353 23.314 2.61 3.652 13.048 5.567 17.746 7.481 3.48 1.565 8.874 2.958 12.005 4.871 5.915 3.652 11.83 7.83 17.398 11.83 2.784 2.088 11.482 6.438 12.005 9.917z" fill="#00546B"/><path d="M58.186 43.022c-2.957 0-5.044.35-7.132.871v.348h.348c1.393 2.784 3.827 4.698 5.566 7.133 1.393 2.783 2.61 5.568 4.003 8.352.173-.175.347-.348.347-.348 2.437-1.741 3.654-4.524 3.654-8.7-1.044-1.217-1.218-2.435-2.088-3.653-1.043-1.741-3.306-2.61-4.698-4.003z" fill="#00546B"/></svg>`,
            vue: `<svg width="2500" height="2158" viewBox="0 0 256 221" xmlns="http://www.w3.org/2000/svg"     preserveAspectRatio="xMinYMin meet">    <path d="M204.8 0H256L128 220.8 0 0h97.92L128 51.2 157.44 0h47.36z" fill="#41B883"/>    <path d="M0 0l128 220.8L256 0h-51.2L128 132.48 50.56 0H0z" fill="#41B883"/>    <path d="M50.56 0L128 133.12 204.8 0h-47.36L128 51.2 97.92 0H50.56z" fill="#35495E"/></svg>`,
            fsharp: `<?xml version="1.0" encoding="UTF-8" standalone="no"?><!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools --><svg width="800" height="800" viewBox="0 -6.5 256 256" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid">\t<g>\t\t<path d="M0,121.491525 L121.491525,0 L121.491525,60.7457627 L60.7457627,121.491525 L121.491525,182.237288 L121.491525,242.983051 L0,121.491525 L0,121.491525 Z" fill="#378BBA"></path>\t\t<path d="M78.1016949,121.491525 L121.491525,78.1016949 L121.491525,164.881356 L78.1016949,121.491525 L78.1016949,121.491525 Z" fill="#378BBA"></path>\t\t<path d="M256,121.491525 L130.169492,0 L130.169492,60.7457627 L190.915254,121.491525 L130.169492,182.237288 L130.169492,242.983051 L256,121.491525 L256,121.491525 Z" fill="#30B9DB"></path>\t</g></svg>`,
            php: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="241.025" height="136.182" viewBox="0 0 241.025 136.182"><defs><clipPath id="a"><path d="M1.9,15.4c0,36.118,53.106,65.4,118.613,65.4s118.613-29.28,118.613-65.4S186.019-50,120.512-50,1.9-20.718,1.9,15.4" transform="translate(-1.899 49.999)"/></clipPath><radialGradient id="b" cx="0.628" cy="0.8" r="1.248" gradientTransform="translate(-0.009 0.511) scale(0.526 1)" gradientUnits="objectBoundingBox"><stop offset="0" stop-color="#aeb2d5"/><stop offset="0.3" stop-color="#aeb2d5"/><stop offset="0.75" stop-color="#484c89"/><stop offset="1" stop-color="#484c89"/></radialGradient><clipPath id="c"><path d="M0-52.692H241.025V83.49H0Z" transform="translate(0 52.692)"/></clipPath></defs><g transform="translate(0 52.692)"><g transform="translate(1.899 -49.999)" clip-path="url(#a)"><path d="M1.9,15.4c0,36.118,53.106,65.4,118.613,65.4s118.613-29.28,118.613-65.4S186.019-50,120.512-50,1.9-20.718,1.9,15.4" transform="translate(-1.899 49.999)" fill="url(#b)"/></g><g transform="translate(0 -52.692)" clip-path="url(#c)"><path d="M114.853,64.94c61.4,0,111.173-25.337,111.173-56.591S176.251-48.243,114.853-48.243,3.68-22.906,3.68,8.348,53.454,64.94,114.853,64.94" transform="translate(5.66 59.742)" fill="#777bb3"/></g><g transform="translate(0 -52.692)" clip-path="url(#c)"><path d="M43.418-1.986c5.049,0,8.817-.935,11.2-2.778,2.359-1.824,3.989-4.986,4.843-9.4.8-4.122.493-7-.9-8.553C57.136-24.3,54.053-25.1,49.4-25.1H41.332L36.859-1.986h6.558ZM17.029,26.49a1.252,1.252,0,0,1-.968-.459,1.265,1.265,0,0,1-.264-1.042L27.651-36.272a1.257,1.257,0,0,1,1.232-1.02H54.431c8.029,0,14.005,2.186,17.762,6.509,3.776,4.342,4.943,10.412,3.466,18.04a28.9,28.9,0,0,1-3.071,8.579,28.718,28.718,0,0,1-5.653,7.116,24.781,24.781,0,0,1-9.3,5.6A41.969,41.969,0,0,1,44.847,10.2H34.5L31.548,25.47a1.257,1.257,0,0,1-1.232,1.021H17.029Z" transform="translate(24.259 77.093)"/><path d="M43.128-23.069h7.033c5.616,0,7.567,1.238,8.23,1.975,1.1,1.225,1.307,3.807.6,7.468-.794,4.1-2.266,7-4.376,8.635-2.16,1.67-5.672,2.517-10.436,2.517H39.143l3.985-20.6ZM55.192-37.78H29.644a2.513,2.513,0,0,0-2.464,2.04L15.326,25.522a2.519,2.519,0,0,0,2.464,3H31.076a2.514,2.514,0,0,0,2.465-2.041L36.3,12.238h9.31A43.2,43.2,0,0,0,58.78,10.524a26.033,26.033,0,0,0,9.772-5.878,29.877,29.877,0,0,0,5.892-7.421,30.271,30.271,0,0,0,3.209-8.954c1.555-8.03.292-14.46-3.753-19.11-4.005-4.606-10.3-6.941-18.707-6.941M36.1.049h8.081q8.034,0,11.968-3.041t5.309-10.154q1.318-6.829-1.2-9.638T50.162-25.591h-9.1L36.1.048M55.193-35.258q11.528,0,16.817,6.078t3.179,16.97a27.515,27.515,0,0,1-2.935,8.2,27.323,27.323,0,0,1-5.407,6.8A23.458,23.458,0,0,1,58,8.126a40.554,40.554,0,0,1-12.394,1.59H34.228L31.078,26H17.792L29.644-35.258H55.192" transform="translate(23.499 76.32)" fill="#fff"/><path d="M71.849,20.188a1.251,1.251,0,0,1-.968-.459,1.264,1.264,0,0,1-.264-1.042L75.86-8.419c.5-2.578.376-4.428-.346-5.21-.442-.478-1.769-1.279-5.694-1.279h-9.5L53.728,19.168A1.257,1.257,0,0,1,52.5,20.188H39.315a1.259,1.259,0,0,1-1.232-1.5L49.937-42.574a1.257,1.257,0,0,1,1.232-1.02H64.35a1.253,1.253,0,0,1,.969.459,1.265,1.265,0,0,1,.264,1.043L62.722-27.307H72.941c7.785,0,13.064,1.379,16.139,4.215,3.138,2.893,4.112,7.519,2.907,13.753L86.472,19.168a1.257,1.257,0,0,1-1.232,1.021H71.85Z" transform="translate(58.531 67.108)"/><path d="M65.11-44.082H51.929a2.514,2.514,0,0,0-2.465,2.041L37.611,19.22a2.519,2.519,0,0,0,2.465,3H53.257a2.514,2.514,0,0,0,2.465-2.041l6.4-33.055h8.465c3.918,0,4.74.841,4.773.877.238.256.55,1.446.034,4.111L70.146,19.22a2.519,2.519,0,0,0,2.465,3H86a2.514,2.514,0,0,0,2.465-2.041L93.981-8.326c1.294-6.691.187-11.712-3.289-14.921C87.374-26.307,81.817-27.8,73.7-27.8h-8.7l2.571-13.284a2.53,2.53,0,0,0-.527-2.085,2.506,2.506,0,0,0-1.937-.918m0,2.522L61.961-25.273H73.7q11.083,0,15.29,3.883T91.517-8.807L86,19.7H72.612L77.855-7.4q.9-4.625-.659-6.308T70.583-15.4H60.047l-6.79,35.1H40.076L51.93-41.56H65.111" transform="translate(57.77 66.334)" fill="#fff"/><path d="M84.278-1.986c5.049,0,8.817-.935,11.2-2.778,2.359-1.824,3.989-4.985,4.843-9.4.8-4.122.493-7-.9-8.553C98-24.3,94.913-25.1,90.26-25.1H82.192L77.719-1.986h6.558ZM57.89,26.49a1.252,1.252,0,0,1-.968-.459,1.265,1.265,0,0,1-.264-1.042L68.511-36.272a1.257,1.257,0,0,1,1.233-1.02H95.291c8.03,0,14.005,2.186,17.762,6.509,3.776,4.342,4.942,10.411,3.466,18.04a28.913,28.913,0,0,1-3.072,8.579,28.719,28.719,0,0,1-5.653,7.116,24.781,24.781,0,0,1-9.3,5.6A41.969,41.969,0,0,1,85.707,10.2H75.361L72.408,25.47a1.257,1.257,0,0,1-1.233,1.021H57.889Z" transform="translate(87.097 77.093)"/><path d="M83.988-23.069h7.033c5.616,0,7.567,1.238,8.23,1.975,1.1,1.225,1.308,3.807.6,7.467-.794,4.1-2.267,7-4.376,8.636C93.315-3.32,89.8-2.474,85.039-2.474H80l3.984-20.6ZM96.051-37.78H70.5a2.514,2.514,0,0,0-2.464,2.04L56.186,25.522a2.519,2.519,0,0,0,2.464,3H71.936A2.514,2.514,0,0,0,74.4,26.484l2.756-14.246h9.31A43.2,43.2,0,0,0,99.64,10.524a26.034,26.034,0,0,0,9.773-5.879A29.95,29.95,0,0,0,115.3-2.775a30.154,30.154,0,0,0,3.209-8.954c1.555-8.03.292-14.46-3.753-19.11-4.005-4.605-10.3-6.941-18.707-6.941M76.958.049h8.081q8.034,0,11.968-3.041t5.309-10.154q1.319-6.829-1.2-9.638T91.022-25.591h-9.1L76.958.048M96.053-35.258q11.528,0,16.817,6.078t3.179,16.97a27.515,27.515,0,0,1-2.935,8.2,27.323,27.323,0,0,1-5.407,6.8,23.457,23.457,0,0,1-8.843,5.33,40.554,40.554,0,0,1-12.394,1.59H75.088L71.937,26H58.652L70.505-35.258H96.053" transform="translate(86.337 76.32)" fill="#fff"/></g></g></svg>`,
        };
        const skills = [
            {
                point: points[0],
                vertices: PhysicsHelper.GetVerticesOfSvg(points[0], svgs.nodejs, 4 * (isMobile ? 0.5 : 1), true),
            },
            {
                point: points[1],
                vertices: PhysicsHelper.GetVerticesOfSvg(points[1], svgs.csharp, 0.3 * (isMobile ? 0.5 : 1), true),
            },
            {
                point: points[2],
                vertices: PhysicsHelper.GetVerticesOfSvg(points[2], svgs.mysql, 0.75 * (isMobile ? 0.5 : 1), false),
            },
            {
                point: points[3],
                vertices: PhysicsHelper.GetVerticesOfSvg(points[3], svgs.vue, 0.3 * (isMobile ? 0.5 : 1), false),
            },
            {
                point: points[4],
                vertices: PhysicsHelper.GetVerticesOfSvg(points[4], svgs.fsharp, 1 * (isMobile ? 0.5 : 1), true),
            },
            {
                point: points[5],
                vertices: PhysicsHelper.GetVerticesOfSvg(points[5], svgs.php, 0.2 * (isMobile ? 0.5 : 1), true),
            },
        ];
        this.skills = skills.map(skill => {
            skill.body = this.getSvgBody(skill.point, skill.vertices);
            return skill;
        });
    }

    AddBox(x, y, width, height, info) {
        const box = shallowRef(Bodies.rectangle(x, y, width, height));
        Composite.add(this.engine.value.world, [box.value]);
        this.bodies.push(box.value);
    }

    getSvgBody(point, vertices) {
        return shallowRef(Bodies.fromVertices(point.x, point.y, vertices, {}, true));
    }

    AddSkill() {
        if (this.skills.length > 0) {
            const index = Math.floor(Math.random() * this.skills.length);
            const skill = this.skills[index];
            this.skills.splice(index, 1);
            this.usedSkills.push(skill.body);
            this.AddSvg(index, skill);
        } else {
            const index = Math.floor(Math.random() * this.usedSkills.length);
            const body = this.usedSkills[index];
            this.UpdatePosition(body, PhysicsHelper.GetRandomPosition(this.width))
        }
    }

    AddSvg(index, svg) {
        Composite.add(this.engine.value.world, svg.body.value);
        this.bodies.push(svg.body);
        self.postMessage({status: 'add_body', index: index, body: svg.body.value});
    }

    Start() {
        Runner.run(this.runner.value, this.engine.value);
        Events.on(this.engine.value, 'afterUpdate', () => {
            this.bodies.forEach(body => {
                self.postMessage({status: 'update_body', body: body.value});
            });
        });
    }

    OnResize(width, height) {
        this.width = width;
        this.height = height;
        if (this.walls.length > 0) {
            this.walls[0].value.position.x = width / 2;
            this.walls[0].value.position.y = height + 50;
            this.walls[0].value.width = width + 100;
            this.walls[0].value.height = 100;
            this.walls[1].value.position.x = width / 2;
            this.walls[1].value.position.y = -50;
            this.walls[1].value.width = width + 100;
            this.walls[1].value.height = 100;
            this.walls[2].value.position.x = -50;
            this.walls[2].value.position.y = height / 2;
            this.walls[2].value.width = 100;
            this.walls[2].value.height = height + 100;
            this.walls[3].value.position.x = width + 50;
            this.walls[3].value.position.y = height / 2;
            this.walls[3].value.width = 100;
            this.walls[3].value.height = height + 100;
        }
    }

    UpdatePosition(body, position) {
        Body.set(body.value, "position", position);
    }
}

const physicsWorker = new PhysicsWorker();

self.addEventListener('message', (e) => {
    const data = e.data;
    postMessage('WORKER STARTED');
    switch (data.cmd) {
        case 'init':
            physicsWorker.Initialize(data.width, data.height, JSON.parse(data.skills));
            self.postMessage({status: 'init_finished'});
            break;
        case 'add_skill':
            physicsWorker.AddSkill();
            self.postMessage('matter js: Added skill');
            break;
        case 'resize':
            physicsWorker.OnResize(data.width, data.height);
            self.postMessage('matter js: Rezie applied');
            break;
        case 'stop':
            self.postMessage('matter js: Terminated');
            self.close();
            break;
        default:
            self.postMessage('Unknown command: ' + data);
    }
}, false);
