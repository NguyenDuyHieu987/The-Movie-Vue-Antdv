<template>
  <a-layout-footer class="footer">
    <div class="footer-container">
      <div class="logo">
        <router-link :to="{ name: 'home' }">
          <img src="/images/film-reel.png" style="height: 50px" />
          <h1>Phimhay247</h1>
        </router-link>
      </div>

      <p class="note">
        Mọi thông tin, hình ảnh, video trên website đều được sưu tầm trên
        Internet. Chúng tôi không sở hữu hay chịu trách nhiệm bất kỳ thông tin
        nào trên web này. Nếu làm ảnh hưởng đến cá nhân hay tổ chức nào, khi
        được yêu cầu, chúng tôi sẽ xem xét và gỡ bỏ ngay lập tức.
      </p>

      <div class="support">
        <p>Mọi thông tin liên quan vui lòng liên hệ qua:</p>
        <a
          class="facebook"
          target="blank"
          href="https://www.facebook.com/nguyen.d.hieu.355"
        >
          <font-awesome-icon icon="fa-brands fa-facebook-f" />
          facebook
        </a>
        <a class="email" href="mailto:vaicut6941@gmail.com"
          ><font-awesome-icon icon="fa-regular fa-envelope" />
          Email: vaicut6941@gmail.com
        </a>
      </div>
    </div>
    <p class="copyright">© Copyright by 2022 Phimhay247 All Right Reserved</p>
  </a-layout-footer>
</template>

<style scoped lang="scss" src="./Footer.scss"></style>
