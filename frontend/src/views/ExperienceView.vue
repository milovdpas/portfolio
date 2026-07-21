<template>
  <div>
    <Menu></Menu>
    <main>
      <section id="header" class="header">
        <div class="content">
          <div class="text">
            <h1>{{ $t('experience.title') }}</h1>
            <div class="underline"/>
            <p class="description">{{ $t('experience.description') }}</p>
          </div>
          <div class="ctas row">
            <CTA class="col-md-4" link="#program" color="yellow" :icon="icons.down">{{ $t('experience.programSkills') }}</CTA>
            <CTA class="col-md-4" link="#social" color="green" :icon="icons.down">{{ $t('experience.socialSkills') }}</CTA>
            <CTA class="col-md-4" link="#jobs" color="orange" :icon="icons.down">{{ $t('experience.jobs') }}</CTA>
          </div>
        </div>
        <div class="side-bar"></div>
      </section>
      <PhysicsSkillsSection section-id="program" color="yellow" :skills="programSkills"
                            :title="$t('experience.programSkills')"
                            :button-label="$t('experience.spawnButton')"/>
      <PhysicsSkillsSection section-id="social" color="green" :skills="socialSkills"
                            :title="$t('experience.socialSkills')"
                            :button-label="$t('experience.spawnButton')"/>
      <section id="jobs" class="jobs">
        <div class="title">
          <h2>{{ $t('experience.jobs') }}</h2>
        </div>
        <TimelineSlider :timePeriods="timePeriods"/>
      </section>
    </main>
    <section>
      <Footer/>
    </section>
  </div>
</template>

<script>
import Menu from "../components/Menu.vue";
import Footer from "@/components/Footer.vue";
import CTA from "@/components/buttons/CTA.vue";
import TimelineSlider from "@/components/sliders/TimelineSlider.vue";
import PhysicsSkillsSection from "@/components/skills/PhysicsSkillsSection.vue";
import {programSkills, socialSkills} from "@/config/skills";
import {isMobile} from "@/utils/device";

export default {
  name: "ExperienceView",
  components: {
    Menu,
    Footer,
    CTA,
    TimelineSlider,
    PhysicsSkillsSection,
  },
  data() {
    return {
      icons: {
        down: new URL(`../assets/images/icons/down-arrow.svg`, import.meta.url).href,
      },
      programSkills,
      socialSkills,
    }
  },
  computed: {
    timePeriods() {
      return this.$tm('experience.jobsList').map(job => ({
        title: job.title,
        period: {
          short: job.periodShort,
          long: job.periodLong,
        },
        description: job.description,
      }));
    }
  },
  methods: {
    isMobile
  },
}
</script>

<style lang="scss" scoped>
/* Header */
.header {
  display: flex;
  @include full-height;

  .content {
    @include full-height;
    width: 67.5%;

    .text {
      display: flex;
      flex-flow: column;
      justify-content: center;
      height: 75%;

      h1 {
        font-size: 60px;
        font-weight: bold;
      }

      .description {
        font-size: 22.5px;
        font-weight: normal;
      }
    }

    .ctas {
      height: 25%;
      width: 100%;
      margin: 0;
    }
  }

  .side-bar {
    @include full-height;
    width: 32.5%;
    background-color: $red;
  }
}

/** Jobs **/
.jobs {
  position: relative;
  @include full-height;
  background-color: $orange;
  text-align: left;

  .title {
    position: absolute;
    padding: 3em 5em 0 5em;
    background: #fcac45;
    z-index: 2;
    width: 75%;

    h2 {
      font-size: 50px;
    }
  }
}

@include mobile {
  .header {
    .content {
      width: 100%;

      h1 {
        z-index: 1;
      }

      .text {
        height: 60%;
      }

      .ctas {
        height: 40%;
        // Keep the last stacked CTA above the OS gesture bar / home indicator.
        padding-bottom: env(safe-area-inset-bottom, 0px);
      }
    }

    .underline {
      background-color: $red;
      height: 5px;
      width: 75%;
      align-self: center;
      transform: translateY(-14px);
      z-index: 0;
    }

    .side-bar {
      display: none;
    }
  }

  .jobs {
    .title {
      padding: 2em 2em 0 2em;

      h2 {
        font-size: 35px;
      }
    }
  }
}
</style>
