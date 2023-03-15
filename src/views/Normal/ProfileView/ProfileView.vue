<template>
  <div class="profile" style="height: 100%">
    <h2>Username: {{ $store.state.userAccount?.username }}</h2>
    <h3>Email: {{ $store.state.userAccount?.email }}</h3>
    <h3>Fullname: {{ $store.state.userAccount?.full_name }}</h3>
  </div>
</template>

<script></script>

<style lang="scss" src="./ProfileView.scss"></style>
