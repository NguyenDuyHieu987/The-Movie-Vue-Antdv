<template>
  <a-layout-footer class="footer">
    <div class="footer-container">
      <div class="logo">
        <router-link :to="{ name: 'home' }">
          <img src="../assets/images/film-reel.png" style="height: 50px" />
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

<style scoped lang="scss">
.ant-layout-footer.footer {
  /* color: var(--text-color); */
  background-color: var(--footer-background-color);
  border-top: 1px solid var(--border-regular);
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  flex-direction: column;

  .footer-container {
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

    .note {
      margin-top: 20px;
    }
    .support {
      margin-top: 15px;

      p {
        margin-bottom: 10px;
      }

      a + a {
        margin-left: 15px;
      }

      a {
        color: #fff;
      }

      .facebook {
        color: #1890ff;
        &:hover {
          color: #188fffd2;
        }
      }

      .email {
        color: #ff6a00;
        &:hover {
          color: #ff6a00d1;
        }
      }
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
