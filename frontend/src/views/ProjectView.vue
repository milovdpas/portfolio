<template>
  <div>
    <Menu></Menu>
    <div class="container">
      <div class="blog">
        <div v-for="projectItem in projects[slug]">
          <h1 v-if="projectItem.type==='title'" v-html="projectItem.content"></h1>
          <div v-if="projectItem.type==='image'" class="image" :style="`background: ${projectItem.background};`">
            <img :width="projectItem.width" :src="projectItem.src" :alt="projectItem.alt"/>
          </div>
          <div v-if="projectItem.type==='video'" class="video" :style="`background: ${projectItem.background};`">
            <video controls :width="projectItem.width">
              <source :src="projectItem.src" type="video/mp4" />

              Download the
              <a :href="projectItem.src">MP4</a>
              video.
            </video>
          </div>
          <p v-if="projectItem.type==='paragraph'" class="paragraph" v-html="projectItem.content"></p>
        </div>
      </div>
    </div>
    <Footer/>
  </div>
</template>

<script>

import Menu from "@/components/Menu.vue";
import Footer from "@/components/Footer.vue";

export default {
  name: "ProjectView",
  props: {},
  components: {Footer, Menu},
  data() {
    return {
      slug: this.$route.params.slug,
      projects: {
        ['player0.0']: [
          {
            type: 'title',
            content: 'Player 0.0 Heineken'
          },
          {
            type: 'image',
            src: new URL(`../assets/images/projects/player0.0.png`, import.meta.url).href,
            alt: 'image'
          },
          {
            type: 'paragraph',
            content: 'Player 0.0 is a cool gaming experience that we developed for Heineken 0.0 and has been released in many markets, including Poland, Ecuador, Croatia, Slovenia, Bosnia, Spain, Japan, Australia, Ireland, Chile, Malaysia, Panama, Singapore, Paraguay, Bulgaria, and the United States.'
          },
          {
            type: 'video',
            src: new URL(`../assets/videos/projects/player0.0.mp4`, import.meta.url).href,
            background: '#008200',
            width: 750
          },
          {
            type: 'paragraph',
            content: 'Due to the game\'s release in so many markets, we had to create a robust backend and database capable of serving a large number of users simultaneously. During the development of this backend, I learned a lot about creating the right indexes in a database and how to efficiently handle large volumes of data.'
          },
          {
            type: 'paragraph',
            content: 'For example, we had to store duplicate data in our database to make the leaderboard endpoint faster.'
          },
          {
            type: 'paragraph',
            content: 'It’s really fun and exciting to see how many people are playing this game. The best players will compete against each other in a sim racing experience, and the winner of this final race will win two tickets to the Dutch Grand Prix and have a chance to sim race against F1 triple world champion Max Verstappen.'
          },
        ],
        soundzam: [
          {
            type: 'title',
            content: 'SoundZam App'
          },
          {
            type: 'image',
            src: new URL(`../assets/images/projects/soundzam-app.png`, import.meta.url).href,
            alt: 'image'
          },
          {
            type: 'paragraph',
            content: 'When I was watching a YouTube video I heard a song that was on SoundCloud and I wanted to know what the name of song was. So I started looking in the comment section for answers, to my disappointment nobody knew what the name of the song was. So than I thought maybe Shazam can recognize this song, but I found out that Shazam could only recognize Spotify, ITunes and YouTube.'
          },
          {
            type: 'paragraph',
            content: 'Than I thought to myself if there is no solution for this problem, why not make it myself! So I started researching how I could solve this problem. There were 2 options. The first was to use the SoundCloud api to get all the fragments of the most popular songs of each day with a cron job. Or data mine the site every day with a cron job and a python script. The first option was eliminated when I found out that SoundCloud was not giving new access to the SoundCloud API, because the were rethinking the process of giving access to the API. So than I was only left with the second option <strong>data mining</strong>, so I started developing a python script that would go on the homepage, than would redirect to every hitlist and here would data mine every song in the hitlist.'
          },
          {
            type: 'paragraph',
            content: 'After developing this python script, I started with a prototype of the app. So that I would have more leverage at asking for a partnership or cooperation with SoundCloud. In the video below you can see the flow of the app.'
          },
          {
            type: 'video',
            src: new URL(`../assets/videos/projects/soundzam-clip.mp4`, import.meta.url).href,
            background: '#75627B',
            width: 250,
          },
          {
            type: 'paragraph',
            content: 'After sending the prototype and idea to SoundCloud support, they notified me that the could not give me access to the API nor would they allow me to data mine there website. Because it was against their policy.'
          },
          {
            type: 'paragraph',
            content: 'After this I made a simple Node.js API, that used an Audd API to recognize songs so that I for now could finish the project.'
          },
          {
            type: 'paragraph',
            content: 'I may revisited this project, when SoundCloud reopens access to their API. The project is open source so can be found on this <a href="https://github.com/milovdpas/SoundZam" target="_blank">repository</a>.'
          }
        ],
        ['internship-io']: [
          {
            type: 'title',
            content: 'Our Internship at iO: Driving Innovation in Workplace Efficiency'
          },
          {
            type: 'image',
            src: new URL(`../assets/images/projects/internship/banner.png`, import.meta.url).href,
            alt: 'Image of the internship project'
          },
          {
            type: 'paragraph',
            content: 'From January to June 2023, Wessel van Tilburg and I, embarked on an exciting internship at iO, an end-to-end agency known for its expertise in marketing, technology, and strategy. Together, we tackled a real-world challenge and gained invaluable professional experience along the way.'
          },
          {
            type: 'paragraph',
            content: 'Our project aimed to solve inefficiencies in finding available workspaces in busy office environments. Employees often spent up to 20 minutes searching for desks, wasting over 87 hours annually.'
          },
          {
            type: 'image',
            src: new URL(`../assets/images/projects/internship/image23.png`, import.meta.url).href,
            alt: 'Image of the internship project',
            width: 500,
          },
          {
            type: 'image',
            src: new URL(`../assets/images/projects/internship/image24.png`, import.meta.url).href,
            alt: 'Image of the internship project',
            width: 200,
          },
          {
            type: 'paragraph',
            content: 'To address this, we developed a user-friendly real-time app, a comprehensive web portal, and a scalable backend system.'
          },
          {
            type: 'image',
            src: new URL(`../assets/images/projects/internship/architecture-2.png`, import.meta.url).href,
            alt: 'Image of the internship project'
          },
          {
            type: 'paragraph',
            content: 'By the end of our internship, we achieved a remarkable 90% improvement in booking efficiency, allowing employees to reserve workspaces in just 30-45 seconds.'
          },
          {
            type: 'paragraph',
            content: 'Key technologies and methods included React Native for cross-platform app development, a microservices backend architecture using RabbitMQ, multiple databases (sql and nosql) and CI/CD pipelines with GitHub Actions, Docker and Kubernetes.'
          },
          {
            type: 'image',
            src: new URL(`../assets/images/projects/internship/technologies.png`, import.meta.url).href,
            alt: 'Image of the technologies that were used'
          },
          {
            type: 'paragraph',
            content: 'This experience was transformative for both of us. I honed my skills in backend development and DevOps, while Wessel focused on app development and UX design, both of us growing significantly as developers and professionals.'
          },
          {
            type: 'paragraph',
            content: `Here are some demo's of the applications:`
          },
          {
            type: 'image',
            src: new URL(`../assets/videos/projects/io-portal-demo-1.gif`, import.meta.url).href,
            alt: 'Demo of the web portal',
            background: '#E5D2E0',
          },
          {
            type: 'image',
            src: new URL(`../assets/videos/projects/io-portal-demo-2.gif`, import.meta.url).href,
            alt: 'Demo of the web portal',
            background: '#E5D2E0',
          },
          {
            type: 'image',
            src: new URL(`../assets/videos/projects/io-app-demo.gif`, import.meta.url).href,
            alt: 'Demo of the app',
            background: '#E5D2E0',
            width: 200,
          },
        ],
        'nh-samen-veilig': [
          {
            type: 'title',
            content: 'NH Samen Veilig Trainingsplatform'
          },
          {
            type: 'image',
            src: new URL(`../assets/images/projects/trainingsplatform.png`, import.meta.url).href,
            alt: 'image'
          },
          {
            type: 'paragraph',
            content: 'My role in this project was a Full Stack developer at LiveWall Group. So I made the front- and backend for this project. LiveWall has also written an <a href="https://www.livewall.nl/cases/noordholland-samen-veilig-e-learning-content-productie" target="_blank">article</a> about this project.'
          },
          {
            type: 'paragraph',
            content: 'This project was made in cooperation with NH Samen Veilig. NH Samen Veilig is the partnership between 32 different municipalities, the police and the Public Prosecution Service, within the North Holland unit. FIT, the Financial Intelligence Team, approached LiveWall with a clear request: "Help local police officers, BOAs and bailiffs recognize the signals of unusual possession better, faster and more effectively."'
          },
          {
            type: 'paragraph',
            content: 'This project was made in cooperation with NH Samen Veilig. NH Samen Veilig is the partnership between 32 different municipalities, the police and the Public Prosecution Service, within the North Holland unit. FIT, the Financial Intelligence Team, approached LiveWall with a clear request: "Help local police officers, BOAs and bailiffs recognize the signals of unusual possession better, faster and more effectively."'
          },
          {
            type: 'image',
            src: new URL(`../assets/images/projects/trainingsplatform-2.png`, import.meta.url).href,
            alt: 'image'
          },
          {
            type: 'paragraph',
            content: 'During this project I made 2 different modules for the training platform, were in the first module they needed to detect signals of unusual possession by tagging a signal at the right moment in the video. And in the second module they always would get 2 options in a interactive video and depending on the option they would chose the would get a different outcome.',
          }
        ],
        'dpg-motm': [
          {
            type: 'title',
            content: 'DPG Media Line-up, Substitution and MOTM tool'
          },
          {
            type: 'image',
            src: new URL(`../assets/images/projects/motm.jpg`, import.meta.url).href,
            alt: 'image'
          },
          {
            type: 'paragraph',
            content: 'My role in this project was as a Backend developer at LiveWall Group.'
          },
          {
            type: 'paragraph',
            content: 'For this project we had to make 3 tools: the Line-up tool, the substitution tool and the Man of the match tool. And these tools would be used for all the games of Belgium and the Netherlands during the WK of 2022.'
          },
          {
            type: 'paragraph',
            content: 'The line-up tool would be used before the games, supporters could guess or input their favorite squad in the tool. And news websites could use a widget that we developed to show the favourite line-up of the supporters.'
          },
          {
            type: 'paragraph',
            content: 'The substitution tool would be used during the game and supporters could chose every 5 minutes three substitutes. News websites could use a widget to show which three players the supporters wanted to be substituted off.'
          },
          {
            type: 'image',
            src: new URL(`../assets/images/projects/motm-list.jpg`, import.meta.url).href,
            alt: 'image'
          },
          {
            type: 'paragraph',
            content: 'And last the man of the match tool would be used after the game ended and supporters could chose one man of the match. News websites could use a widget to show the top man of the match of that game and the percentage of the votes that the player got.'
          },
          {
            type: 'paragraph',
            content: 'This project was really fun, because I had to study a <a href="http://persgroep.api.infostradasports.com" target="_blank">sport API</a> and with cron jobs I would get data out of the API and store it into an own designed database. I also learned to minimize my SQL query length and to use indexes in my database, because on one occasion all the databases crashed. Oopsie🤦🏻‍♂️'
          },
        ],
        ['internship-livewall']: [
          {
            type: 'title',
            content: 'My First Internship: A Journey of Code, Challenges, and Growth'
          },
          {
            type: 'image',
            src: new URL(`../assets/images/projects/internship-livewall/banner.jpg`, import.meta.url).href,
            alt: 'Banner image of the internship'
          },
          {
            type: 'paragraph',
            content: 'Over a few months at LiveWall Group BV, I dove headfirst into the world of backend development, tackling challenges, learning new tech, and working on some pretty cool projects.'
          },
          {
            type: 'image',
            src: new URL(`../assets/images/projects/internship-livewall/node.png`, import.meta.url).href,
            alt: 'Image of Node.js'
          },
          {
            type: 'paragraph',
            content: 'LiveWall had recently adopted the Laravel framework for many of its projects. However, performance bottlenecks became apparent when handling high user traffic, particularly for applications like “Man Of The Match,” where the system needed to process over 10,000 requests in a span of minutes. My primary objective was clear: find a more efficient framework that could support large-scale performance requirements and deliver a boilerplate and documentation to streamline future projects.'
          },
          {
            type: 'image',
            src: new URL(`../assets/images/projects/internship-livewall/edit-performance.png`, import.meta.url).href,
            alt: 'Image of performance results'
          },
          {
            type: 'paragraph',
            content: 'Spoiler alert: We ended up going with Express.js, a Node.js framework that’s as fast as it is flexible. It was a perfect fit for what LiveWall needed. And I created a boilerplate for this framework which is still being used to this day for all the projects of team Engagement.'
          },
          {
            type: 'paragraph',
            content: 'While the framework research was my main gig, I also got to work on a ton of side projects, 17 to be exact. Some of the most fun ones included:<br/>- <b>DPG Speler van de Wedstrijd</b>: Developing APIs and managing match data.<br/>- <b>StukTV Website</b>: Adding features for video content and viewer submissions.<br/>- <b>Legacy of Music</b>: Building a dynamic comment section with moderator tools.<br/>- <b>McDonald\'s Games</b>: Creating leaderboards for Belgian and Spanish campaigns.<br/>- <b>Donald Duck Personalized Comic</b>: Letting users create their own comic strip—over 13,000 registrations in the first week!'
          },
          {
            type: 'image',
            src: new URL(`../assets/images/projects/internship-livewall/donald-duck.jpg`, import.meta.url).href,
            alt: 'Image of Donald Duck personalized comic project'
          },
          {
            type: 'image',
            src: new URL(`../assets/images/projects/internship-livewall/motm.jpg`, import.meta.url).href,
            alt: 'Image of DPG Motm project'
          },
          {
            type: 'paragraph',
            content: 'These projects weren’t just fun—they were incredibly educational. From setting up APIs to dealing with legacy code, each task helped me level up my skills.'
          },
          {
            type: 'paragraph',
            content: 'One of the biggest lessons I learned was the value of flexibility and clear communication. Using Scrum helped me adapt to evolving project needs, and open communication with the team ensured we avoided misalignment in project requirements.'
          },
          {
            type: 'paragraph',
            content: 'The LiveWall team was amazing—always willing to teach, help, or just share a laugh after hours. Shoutout to my mentors, the backend Platforms team, and the other interns for making every day enjoyable.'
          },
          {
            type: 'paragraph',
            content: 'If I had to sum it up, my first internship was a mix of fun, late nights, and big wins. It wasn’t always smooth sailing, but every challenge taught me something new and pushed me to grow. Plus, seeing my code live in action was an awesome feeling.'
          },
          {
            type: 'image',
            src: new URL(`../assets/images/projects/internship-livewall/stuktv.jpg`, import.meta.url).href,
            alt: 'Image of the StukTV project'
          },
          {
            type: 'paragraph',
            content: 'For anyone starting their first internship, here’s my advice: ask questions, try new things, and don’t stress too much if something breaks. Every mistake is just another step toward becoming better.'
          }
        ],
        ['accessibility']: [
          {
            type: 'title',
            content: 'Accessibility Questionnaire App'
          },
          {
            type: 'image',
            src: new URL(`../assets/images/projects/accessibility/banner.png`, import.meta.url).href,
            alt: 'Banner image of the internship'
          },
          {
            type: 'paragraph',
            content: 'During my third year of college, my classmates and I worked on a school project for a real organization. Our task was to create an app for people with visual impairments to fill out questionnaires about buildings they visited. This project was done for Accessibility, an organization based in the Netherlands. Additionally, we were required to develop a web portal to manage all the questionnaires. The exciting part of this project was that it was open-source, and the codebase is still available <a href="https://github.com/Project-Accessibility" target="_blank">here</a>.'
          },
          {
            type: 'paragraph',
            content: 'Our app had several key features that made it easy to use for people with visual impairments:'
          },
          {
            type: 'paragraph',
            content: '<strong>1. Geofencing for Building Zones</strong><br>We implemented geofencing, which could be configured for different sections of a questionnaire through the web portal. When a user entered a specific zone, the relevant sections of the questionnaire would automatically appear on their screen.'
          },
          {
            type: 'image',
            src: new URL(`../assets/images/projects/accessibility/geofencing.jpg`, import.meta.url).href,
            alt: 'Illustration of geofencing in a building'
          },
          {
            type: 'paragraph',
            content: '<strong>2. Support for Various Question Types</strong><br>The app supported a range of question formats, which could all be defined via the web portal. These included open-ended questions, image-based questions, video and audio responses, multiple-choice questions, and range sliders. This made the app highly versatile and adaptive to different needs.'
          },
          {
            type: 'image',
            src: new URL(`../assets/images/projects/accessibility/question-options.png`, import.meta.url).href,
            alt: 'Question options in web portal'
          },
          {
            type: 'paragraph',
            content: '<strong>3. WCAG Compliance</strong><br>Both the app and the web portal were WCAG (Web Content Accessibility Guidelines) approved. This ensured that users with visual impairments or color blindness could easily navigate the app and portal using a screen reader.'
          },
          {
            type: 'image',
            src: new URL(`../assets/images/projects/accessibility/wcag.png`, import.meta.url).href,
            alt: 'WCAG illustration'
          },
          {
            type: 'paragraph',
            content: 'This project taught me a lot about accessibility and app development, as it was my first time working with React Native. Additionally, I gained valuable experience in client communication and learned how to maintain structure and organization in a project-oriented approach.'
          },
          {
            type: 'paragraph',
            content: 'Overall, I am really proud of how the web portal and app turned out. It was a rewarding experience to work on something that could have a meaningful impact instead of just projects for school that will never be used again.'
          },
          {
            type: 'paragraph',
            content: 'Demo:'
          },
          {
            type: 'video',
            src: new URL(`../assets/videos/projects/accessibility.mp4`, import.meta.url).href,
          },
        ]
      }
    }
  }
}
</script>

<style scoped lang="scss">
.container {
  display: flex;
  justify-content: center;
  padding: 5em 24px;

  .blog {
    max-width: 720px;
    text-align: left;

    div {
      max-width: 100%;
      margin-bottom: 24px;

      .image {
        display: flex;
        align-items: center;
        justify-content: center;
        max-width: 100%;

        img {
          max-width: 100%;
        }
      }

      .video {
        display: flex;
        justify-content: center;
        min-width: 100%;

        video {
          max-width: 100%;
        }
      }

      .paragraph {
        font-size: 1.25rem;
      }
    }
  }
}
</style>
