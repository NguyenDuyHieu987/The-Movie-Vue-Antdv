<template>
  <div class="rating-movie">
    <font-awesome-icon
      icon="fa-solid fa-star"
      v-for="(item, index) in 10"
      :key="index"
      :index="index"
    />
    <span id="hint-rate"></span>
    <p>{{ `(${voteAverage?.toFixed(2)} điểm / ${voteCount} lượt)` }}</p>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import { ratingTV, ratingMovie } from '@/services/MovieService';

export default {
  components: {},
  props: {
    voteAverage: Number,
    voteCount: Number,
    movieId: Number,
  },
  setup(props) {
    const hintRating = ref([
      'Dở tệ',
      'Dở',
      'Không hay',
      'Không hay lắm',
      'Bình thường',
      'Xem được',
      'Có vẻ hay',
      'Hay',
      'Rất hay',
      'Tuyệt hay',
    ]);

    const temp = computed(() => Math.round(props?.voteAverage) - 1);

    watch(props, (newVal) => {
      temp.value = newVal?.voteAverage;
    });

    onMounted(() => {
      const stars = document.querySelectorAll('.fa-star');
      const rating_movie = document.querySelector('.rating-movie');
      const hint_rate = document.getElementById('hint-rate');

      for (let i = 0; i < stars.length; ++i) {
        stars[i]?.classList.remove('active');
      }

      for (let i = 0; i <= temp.value; ++i) {
        stars[i]?.classList.add('active');
      }

      for (let i = 0; i < stars.length; ++i) {
        stars[i]?.addEventListener('mouseenter', () => {
          for (let j = 0; j <= i; j++) {
            stars[j].classList.add('active');
            // stars[j].style.color = 'yellow';
          }
          for (let k = i + 1; k < stars.length; k++) {
            stars[k].classList.remove('active');
            // stars[k].style.color = 'white';
          }

          switch (i) {
            case 0:
              hint_rate.innerHTML = 'Dở tệ';
              break;
            case 1:
              hint_rate.innerHTML = 'Dở';
              break;
            case 2:
              hint_rate.innerHTML = 'Không hay';
              break;
            case 3:
              hint_rate.innerHTML = 'Không hay lắm';
              break;
            case 4:
              hint_rate.innerHTML = 'Bình thường';
              break;
            case 5:
              hint_rate.innerHTML = 'Xem được';
              break;
            case 6:
              hint_rate.innerHTML = 'Có vẻ hay';
              break;
            case 7:
              hint_rate.innerHTML = 'Hay';
              break;
            case 8:
              hint_rate.innerHTML = 'Rất hay';
              break;
            case 9:
              hint_rate.innerHTML = 'Tuyệt hay';
              break;
          }
        });

        stars[i].onclick = function () {
          // axios.post(
          //   `https://api.themoviedb.org/3/movie/${movieid}/rating?api_key=fe1b70d9265fdb22caa86dca918116eb&session_id=5ae3c9dd2c824276ba202e5f77298064ccc7085d`,
          //   {
          //     value: i + 1,
          //   }
          // );
          if (props?.isEpisode) {
            ratingTV(props?.movieId, { value: i + 1 });
          } else {
            ratingMovie(props?.movieId, { value: i + 1 });
          }

          temp.value = i;

          for (let j = 0; j <= temp.value; j++) {
            stars[j].classList.add('active');
          }

          for (let k = temp.value + 1; k < stars.length; k++) {
            stars[k].classList.remove('active');
          }
        };
      }

      rating_movie?.addEventListener('mouseleave', () => {
        for (let j = temp.value + 1; j < stars.length; j++) {
          stars[j].classList.remove('active');
        }
        for (let k = 0; k <= temp.value; k++) {
          stars[k].classList.add('active');
        }
        hint_rate.innerHTML = '';
      });
    });

    return { hintRating, ratingTV, ratingMovie };
  },
};
</script>

<style lang="scss" scoped>
.rating-movie {
  margin-top: 15px;
  display: inline-block;
  // display: flex;
  // flex-direction: row;

  .fa-star + .fa-star {
    margin-left: 3px;
  }

  .fa-star.active {
    color: yellow;
  }

  span {
    margin-left: 10px;
  }

  .fa-star {
    font-size: 18px;
    cursor: pointer;
    color: #fff;
    transition: all 0.3s;

    &:hover {
      color: yellow;
    }
  }
}
</style>
