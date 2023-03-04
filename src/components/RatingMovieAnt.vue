<template>
  <div class="rating-movie">
    <a-rate
      v-model:value="vote_Average"
      allow-half
      :count="10"
      :tooltips="tooltipRating"
      character=""
      @change="handleRating"
    />
    <span class="ant-rate-text">{{
      tooltipRating[Math.round(voteAverage) - 1]
    }}</span>
    <p>
      {{ `(${voteAverage?.toFixed(2)} điểm / ${vote_Count} lượt)` }}
    </p>
  </div>
</template>

<script>
import { ref, h } from 'vue';
import { ratingMovie, ratingTV } from '../services/MovieService';
import { notification } from 'ant-design-vue';
import { CheckCircleFilled } from '@ant-design/icons-vue';

export default {
  components: {},
  props: {
    voteAverage: Number,
    voteCount: Number,
    movieId: Number,
    isEpisodes: Boolean,
  },
  setup(props) {
    const vote_Average = ref(props.voteAverage);
    const vote_Count = ref(props.voteCount);

    const tooltipRating = ref([
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

    const handleRating = (value) => {
      if (props?.isEpisodes) {
        ratingTV(props?.movieId, { value: Math.round(value) }).then(
          (response) => {
            console.log(response.data);
            if (response.data?.success == true) {
              notification.open({
                message: 'Cảm ơn bạn đã đánh giá!',
                description: `Đánh giá thành công ${value} điểm.`,
                icon: () =>
                  h(CheckCircleFilled, {
                    style: 'color: green',
                  }),
              });
              vote_Average.value = response.data?.vote_average?.toFixed(2);
              vote_Count.value = response.data?.vote_count;
            }
          }
        );
      } else {
        ratingMovie(props?.movieId, { value: Math.round(value) }).then(
          (response) => {
            if (response.data?.success == true) {
              notification.open({
                message: 'Cảm ơn bạn đã đánh giá!',
                description: `Đánh giá thành công ${value} điểm.`,
                icon: () =>
                  h(CheckCircleFilled, {
                    style: 'color: green',
                  }),
              });
              vote_Average.value = response.data?.vote_average?.toFixed(2);
              vote_Count.value = response.data?.vote_count;
            }
          }
        );
      }
    };

    return { tooltipRating, vote_Average, vote_Count, handleRating };
  },
};
</script>

<style lang="scss" scoped>
.rating-movie {
  margin-top: 15px;
  display: inline-block;
  // display: flex;
  // flex-direction: row;

  .ant-rate {
    font-size: 22px;
  }
}
</style>
