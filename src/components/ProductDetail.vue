<script>
import { onMounted, onUnmounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { ElMessage, ElLoading } from "element-plus";
import { productImages } from "../constants";
import http from "../utils/http";

export default {
  name: "ProductDetail",
  setup() {
    const route = useRouter();
    const timeString = ref(null);

    // update the time every minute
    const updateTime = () => {
      const now = new Date();
      timeString.value = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      document.getElementById("time").textContent = timeString.value;
    };

    onMounted(() => {
      updateTime();
      const timer = setInterval(updateTime, 60 * 1000);
      onUnmounted(() => clearInterval(timer));
      // select the first image as default
      selectImage(productImages[0]);
    });

    watch(
      () => route.path,
      () => {
        updateTime();
      }
    );

    // select product color
    const selectedImage = ref(null);
    const selectedTitle = ref(null);

    const selectImage = (image) => {
      selectedImage.value = image.url;
      selectedTitle.value = image.title;
    };

    // switch baitiao plan options
    const selectedOption = ref("0");
    const selectOption = (option) => {
      selectedOption.value = option;
      selectedPlanNum.value = option;
    };

    // jump to order list page
    const router = useRouter();
    const selectedPlanNum = ref("0");
    const goToOrderList = () => {
      // Note: this is just a demo, you need to implement your own order api logic by axios
      // product place an order
      // http.post("/order/placeOrder", { productId: 1, planNum: selectedPlanNum.value, }).then((response) => {});
      if (selectedPlanNum.value === "0") {
        ElMessage({
          message: "请使用白条下单哦~",
          type: "warning",
          duration: 1500,
        });
      } else {
        const loading = ElLoading.service({
          lock: true,
          text: "交易处理中...",
          background: "rgba(0, 0, 0, 0.7)",
          closed: () => {
            ElMessage({
              message: "交易完成，正在跳转...",
              type: "success",
              duration: 1000,
              onClose: () => {
                router.push("/order-list");
              },
            });
          },
        });
        setTimeout(() => {
          loading.close();
        }, 1200);
      }
    };

    return {
      selectedOption,
      selectOption,
      goToOrderList,
      productImages,
      selectImage,
      selectedImage,
      selectedTitle,
    };
  },
  data() {
    return {
      // get delivery date
      deliveryDate: this.getFormattedDate(),
    };
  },
  methods: {
    getFormattedDate() {
      const today = new Date();
      today.setDate(today.getDate());
      const day = today.getDate();
      const month = today.getMonth() + 1;
      return `${month}月${day}日`;
    },
  },
};
</script>

<style>
/* 样式可以根据需求自定义 */
.carousel-item {
  display: none;
}
.carousel-item.active {
  display: block;
}

.demonstration {
  color: var(--el-text-color-secondary);
}

.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
  text-align: center;
}
</style>

<template>
  <body class="bg-gray-100">
    <div class="max-w-md mx-auto bg-white" id="app" @click="resetButton">
      <div class="relative bg-white">
        <div
          class="top-0 left-0 p-3 flex justify-between w-full text-black text-sm"
        >
          <div id="time"></div>
          <div class="flex items-center space-x-1">
            <i class="fas fa-signal"> </i>
            <i class="fas fa-wifi"> </i>
            <i class="fas fa-battery-full"> </i>
            <span> 100% </span>
          </div>
        </div>
        <div class="block text-center">
          <el-carousel height="400px">
            <el-carousel-item
              class="carousel-item"
              v-for="image in productImages"
              :key="image"
            >
              <img
                alt="Image of iPhone 15 Pro Max"
                class="w-full h-full object-cover"
                :src="image.url"
              />
            </el-carousel-item>
          </el-carousel>
        </div>
      </div>
      <div class="p-4" style="height: 820px">
        <h1 class="text-xl font-bold">iPhone 15 Pro Max</h1>
        <div class="flex items-center space-x-2 mt-2">
          <span class="text-red-500 text-2xl font-bold"> ¥6000 </span>
          <span class="text-gray-500 line-through"> ¥6999 </span>
        </div>
        <div class="text-gray-500 text-sm mt-1">税费：价格已含税</div>
        <div class="mt-2">
          <span class="bg-red-100 text-red-500 text-sm px-2 py-1 rounded">
            满5000减400
          </span>
        </div>
        <div class="mt-4">
          <h2 class="text-lg font-bold">
            【24期免息】苹果15ProMax海外版美版有锁手机全新5G三网通iPhone 15 Pro
            Max
          </h2>
          <div class="text-gray-500 text-sm mt-1">
            超高性价比，当天发货，质保2年
          </div>
          <div class="text-gray-500 text-sm mt-1">已售10000+</div>
        </div>
        <div class="mt-4 flex space-x-2">
          <img
            v-for="image in productImages"
            :key="image"
            :src="image.url"
            @click="selectImage(image)"
            alt="Image of iPhone 15 Pro Max"
            class="w-16 h-16"
            :class="{
              'border-2 border-red-400 border-solid rounded-lg':
                selectedImage === image.url,
            }"
          />
        </div>
        <div class="mt-4 bg-gray-100 p-2 rounded">
          <div class="text-gray-700">
            已选：{{ selectedTitle }}【店保2年】，1件
          </div>
        </div>
        <div class="mt-4">
          <div class="text-gray-700 flex items-center">
            <i class="fas fa-map-marker-alt text-red-500 mr-2"> </i>
            配送：北京市海淀区中关村南大街1号
          </div>
          <div class="text-gray-500 text-sm">
            现货，预计{{ deliveryDate }}24:00前发货
          </div>
        </div>
        <div class="mt-4">
          <div class="flex items-center space-x-2">
            <i class="far fa-check-circle text-green-500"> </i>
            <span class="text-gray-700"> 7天无理由退货（激活后不支持） </span>
          </div>
          <div class="flex items-center space-x-2 mt-2">
            <i class="far fa-check-circle text-green-500"> </i>
            <span class="text-gray-700"> 店铺发货&售后 </span>
          </div>
        </div>
        <div class="mt-4">
          <div class="text-gray-700 flex items-center">
            <i class="fas fa-shipping-fast text-red-500 mr-2"> </i>
            包邮（请以提交订单时为准）
          </div>
        </div>
        <div class="mt-4">
          <div class="text-base mb-2">白条</div>
          <div class="flex overflow-x-auto space-x-2">
            <div
              :class="{
                'bg-red-100 text-red-500': selectedOption === '0',
              }"
              @click.stop="selectOption('0')"
              class="bg-gray-100 p-2 rounded text-center w-24 flex-shrink-0 cursor-pointer"
            >
              <div class="text-gray-700 text-sm">不使用</div>
              <div class="text-gray-500 text-xs">0服务费</div>
            </div>
            <div
              :class="{
                'bg-red-100 text-red-500': selectedOption === '3',
              }"
              @click.stop="selectOption('3')"
              class="bg-gray-100 p-2 rounded text-center w-24 flex-shrink-0 cursor-pointer"
            >
              <div class="text-red-500 text-xs">服务费8折</div>
              <div class="text-gray-700 text-sm">￥2000.00 x 3期</div>
              <div class="text-gray-500 text-xs">含服务费￥21.72/期</div>
            </div>
            <div
              :class="{
                'bg-red-100 text-red-500': selectedOption === '6',
              }"
              @click.stop="selectOption('6')"
              class="bg-gray-100 p-2 rounded text-center w-24 flex-shrink-0 cursor-pointer"
            >
              <div class="text-red-500 text-xs">服务费8折</div>
              <div class="text-gray-700 text-sm">￥1000.00 x 6期</div>
              <div class="text-gray-500 text-xs">含服务费￥16.32/期</div>
            </div>
            <div
              :class="{
                'bg-red-100 text-red-500': selectedOption === '12',
              }"
              @click.stop="selectOption('12')"
              class="bg-gray-100 p-2 rounded text-center w-24 flex-shrink-0 cursor-pointer"
            >
              <div class="text-red-500 text-xs">服务费8折</div>
              <div class="text-gray-700 text-sm">￥500.00 x 12期</div>
              <div class="text-gray-500 text-xs">含服务费￥16.32/期</div>
            </div>
            <div
              :class="{
                'bg-red-100 text-red-500': selectedOption === '24',
              }"
              @click.stop="selectOption('24')"
              class="bg-gray-100 p-2 rounded text-center w-24 flex-shrink-0 cursor-pointer"
            >
              <div class="text-red-500 text-xs">免服务费</div>
              <div class="text-gray-700 text-sm">￥250.00 x 24期</div>
              <div class="text-gray-500 text-xs">含服务费￥16.32/期</div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="fixed bottom-0 left-0 right-0 bg-white p-4 flex justify-between items-center border-t border-gray-200"
      >
        <div class="flex space-x-4">
          <div class="text-center">
            <i class="fas fa-store text-gray-500"> </i>
            <div class="text-gray-500 text-xs">店铺</div>
          </div>
          <div class="text-center">
            <i class="fas fa-headset text-gray-500"> </i>
            <div class="text-gray-500 text-xs">客服</div>
          </div>
          <div class="text-center relative">
            <i class="fas fa-shopping-cart text-gray-500"> </i>
            <div
              class="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
            >
              28
            </div>
            <div class="text-gray-500 text-xs">购物车</div>
          </div>
        </div>
        <div class="flex space-x-4">
          <button class="bg-yellow-500 text-white px-4 py-2 rounded">
            <router-link to="/order-list"> 加入购物车 </router-link>
          </button>
          <button
            :class="{
              'bg-red-500': selectedOption !== null,
              'bg-yellow-500': selectedOption === null,
            }"
            class="text-white px-4 py-2 rounded"
            @click="goToOrderList"
          >
            {{
              selectedOption !== "0"
                ? "&nbsp;&nbsp;打白条&nbsp;&nbsp;"
                : "立即购买"
            }}
          </button>
        </div>
      </div>
    </div>
  </body>
</template>
