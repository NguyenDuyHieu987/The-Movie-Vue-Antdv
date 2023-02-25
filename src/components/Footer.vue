<template>
  <a-layout-footer class="footer">
    <div class="support-container">
      <div class="logo">
        <router-link :to="{ name: 'home' }">
          <img src="../assets/images/film-reel.png" style="height: 50px" />
          <h1>Phimhay247</h1>
        </router-link>
      </div>
      <p>
        Mọi thông tin, hình ảnh, video trên website đều được sưu tầm trên
        Internet. Chúng tôi không sở hữu hay chịu trách nhiệm bất kỳ thông tin
        nào trên web này. Nếu làm ảnh hưởng đến cá nhân hay tổ chức nào, khi
        được yêu cầu, chúng tôi sẽ xem xét và gỡ bỏ ngay lập tức.
      </p>
    </div>
    <p class="copyright">© Copyright by 2022 Phimhay247 All Right Reserved</p>
  </a-layout-footer>
</template>

<style scoped lang="scss">
.ant-layout-footer.footer {
  text-align: center;
  /* color: var(--text-color); */
  background-color: var(--footer-background-color);
  border-top: 1px solid var(--border-regular);
  margin-top: auto;

  .support-container {
    display: flex;
    justify-content: center;
    flex-direction: column;

    .logo {
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        margin-right: 20px;
      }
    }

    p {
      margin-top: 20px;
    }
  }
  .copyright {
    margin-top: 30px;
  }
}

@media only screen and (max-width: 900px) {
  .ant-layout-footer.footer {
    padding: 24px 25px;
  }
}
</style>
