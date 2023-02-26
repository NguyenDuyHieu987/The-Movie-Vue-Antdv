<template>
  <div class="rating-movie">
    <a-rate
      v-model:value="vote_Average"
      allow-half
      :count="10"
      :tooltips="tooltipRating"
      character=""
    />
    <span class="ant-rate-text">{{
      tooltipRating[Math.round(voteAverage) - 1]
    }}</span>
    <p>
      {{ `(${voteAverage?.toFixed(2)} điểm / ${voteCount} lượt)` }}
    </p>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  components: {},
  props: {
    voteAverage: Number,
    voteCount: Number,
    movieId: Number,
  },
  setup(props) {
    const vote_Average = ref(props.voteAverage);
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

    return { tooltipRating, vote_Average };
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
