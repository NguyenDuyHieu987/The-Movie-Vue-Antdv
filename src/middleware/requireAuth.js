import store from '@/store';
import { Modal } from 'ant-design-vue';
import { createVNode } from 'vue';
import { QuestionCircleOutlined } from '@ant-design/icons-vue';

export default function requireAuth(to, from, next) {
  if (!store.state.isLogin) {
    Modal.confirm({
      title: 'Bạn cần đăng nhập để sử dụng chức năng này.',
      icon: createVNode(QuestionCircleOutlined),
      content: createVNode('h3', {}, 'Đăng nhập ngay?'),
      okText: 'Có',
      okType: 'primary',
      cancelText: 'Không',
      centered: true,
      onOk() {
        next({ path: '/login' });
      },
      onCancel() {
        next({ path: from.path });
      },
    });
  } else {
    next();
  }
}
