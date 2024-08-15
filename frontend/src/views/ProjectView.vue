<template>
  <div>
    <Menu></Menu>
    <div class="container">
      <div class="blog">
        <div v-for="projectItem in projects[slug]">
          <h1 v-if="projectItem.type==='title'" v-html="projectItem.content"></h1>
          <div v-if="projectItem.type==='image'" class="image"><img :src="projectItem.src" :alt="projectItem.alt"/></div>
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
