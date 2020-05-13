<template>
  <div class="menu-box" @click="menuClick(menuUrl)">
    <div class="menu">
      <div class="icon">
        <img :src="imgUrl" alt />
      </div>
      <div class="menu-name">{{menuName}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MenuList",
  props: {
    imgUrl: {
      type: String,
      required: true
    },
    menuName: {
      type: String,
      required: true
    },
    menuUrl:{
      type:String
    }
  },
  methods:{
    menuClick(menuUrl){
      this.$router.push(menuUrl)
    }
  }
};
</script>

<style lang="scss" scoped>
.menu-box {
  width: px2rem(250);
  height: px2rem(270);
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #ccc;
  border-right: 1px solid #ccc;
  .menu {
    display: flex;
    flex-direction: column;
    align-items: center;
    .icon {
      width: px2rem(62);
      height: px2rem(62);
      //   text-align: center;
      position: relative;
      img {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
    .menu-name {
      font-size: $text-size;
      margin-top: px2rem(36);
    }
  }
}
</style>