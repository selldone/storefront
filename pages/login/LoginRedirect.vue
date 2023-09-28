<template>
  <div />
</template>

<script>
export default {
  name: "LoginRedirect",
  created() {
    let path = sessionStorage.getItem("after-login-path");

    if (path) {
      sessionStorage.removeItem("after-login-path");
      this.$router.push({ path: path });
    } else {
      this.$router.push({ name: "ShopPage" });
    }
  },
};
</script>

<style scoped></style>
