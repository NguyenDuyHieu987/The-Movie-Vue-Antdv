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

    <!-- <el-rate
      :max="10"
      size="large"
      :colors="['#fadb14', '#fadb14', '#fadb14']"
      v-model="vote_Average"
      :texts="tooltipRating"
      show-text
      allow-half
      @change="handleRating"
    /> -->
    <!-- show-score -->

    <span class="ant-rate-text">{{
      tooltipRating[Math.round(vote_Average) - 1]
    }}</span>
    <p>
      {{ `(${vote_Average?.toFixed(2)} điểm / ${vote_Count} lượt)` }}
    </p>
  </div>
</template>

<script>
import { ref, h } from 'vue';
import { ratingMovie, ratingTV } from '@/services/MovieService';
import { notification } from 'ant-design-vue';
import { CheckCircleFilled } from '@ant-design/icons-vue';
import axios from 'axios';

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
        ratingTV(props?.movieId, { value: value })
          .then((response) => {
            if (response.data?.success == true) {
              notification.open({
                message: 'Cảm ơn bạn đã đánh giá!',
                description: `Đánh giá thành công ${value} điểm.`,
                icon: () =>
                  h(CheckCircleFilled, {
                    style: 'color: green',
                  }),
              });
              vote_Average.value = response.data?.vote_average;
              vote_Count.value = response.data?.vote_count;
            }
          })
          .catch((e) => {
            if (axios.isCancel(e)) return;
          });
      } else {
        ratingMovie(props?.movieId, { value: value })
          .then((response) => {
            if (response.data?.success == true) {
              notification.open({
                message: 'Cảm ơn bạn đã đánh giá!',
                description: `Đánh giá thành công ${value} điểm.`,
                icon: () =>
                  h(CheckCircleFilled, {
                    style: 'color: green',
                  }),
              });
              vote_Average.value = response.data?.vote_average;
              vote_Count.value = response.data?.vote_count;
            }
          })
          .catch((e) => {
            if (axios.isCancel(e)) return;
          });
      }
    };

    return { tooltipRating, vote_Average, vote_Count, handleRating };
  },
};
</script>

<style lang="scss" scoped src="./RatingMovie.scss"></style>
