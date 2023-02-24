<template>
  <div class="lastest-episodes">
    <h3 class="section-title">
      <strong>Tập mới nhất:</strong>
    </h3>
    <ul class="list-episodes">
      <!-- {{Array.from({ length: lastestEpisode }, (_, i) => i + 1)
          .reverse()
          .slice(0, 6)
          .map((item, index) => (
           
          ))}} -->

      <li
        v-for="(item, index) in Array.from(
          { length: lastestEpisode },
          (_, i) => i + 1
        )
          .reverse()
          .slice(0, 10)"
        :index="index"
        :key="index"
      >
        <router-link
          :to="{
            path: `/play/${dataMovie?.id}/${
              dataMovie?.name
                ? dataMovie?.name?.replace(/\s/g, '+').toLowerCase()
                : dataMovie?.title?.replace(/\s/g, '+').toLowerCase()
            }?tap=${item}`,
          }"
          v-if="item === numberOfEpisodes"
        >
          {{ 'Tập ' + item + '-End' }}
        </router-link>
        <router-link
          :to="{
            path: `/play/${dataMovie?.id}/${
              dataMovie?.name
                ? dataMovie?.name?.replace(/\s/g, '+').toLowerCase()
                : dataMovie?.title?.replace(/\s/g, '+').toLowerCase()
            }?tap=${item}`,
          }"
          v-else
        >
          {{ 'Tập ' + item }}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    dataMovie: Object,
    lastestEpisode: Number,
    numberOfEpisodes: Number,
  },
  setup() {
    return {};
  },
};
</script>

<style scoped lang="scss">
.lastest-episodes {
  margin-top: 15px;

  ul.list-episodes {
    // display: flex;
    // flex-direction: row;
    list-style-type: none;
    margin-top: 7px;
    overflow: hidden;

    & > li,
    li + li {
      margin-top: 7px;
      margin-right: 7px;
    }

    li {
      float: left;

      a {
        padding: 7px 15px;
        color: #fff;
        transition: all 0.5s;
        border-radius: 3px;
        white-space: nowrap;
        vertical-align: middle;
        display: inline-block;
        // background-color: #00516c;
        background-image: linear-gradient(
          to right,
          #006a88,
          var(--sider-header-background-color2),
          var(--sider-header-background-color1)
        );
        background-size: 200% 100%;

        &:hover {
          //   background-color: #006b8fb0;
          background-size: 200% 100%;
          background-position: -75px center;
        }
      }
    }
  }
}
</style>
