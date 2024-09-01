<script>
import { onMounted, onUnmounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { productImages, orderList, planList } from "../constants";
import http from "../utils/http";

export default {
  name: "OrderList",
  setup() {
    const route = useRouter();
    const timeString = ref(null);

    // update time every minute
    const updateTime = () => {
      const now = new Date();
      timeString.value = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      document.getElementById("time").textContent = timeString.value;
    };

    // query order list
    const queryOrderInfo = () => {
      // Note: this is just a demo, you need to implement your own query api logic by axios
      // http.get("/order/queryOrder?id=" + id).then((response) => {});
    };
    // get product image
    const getImageSrc = (productName) => {
      const matchedImage = productImages.find(
        (image) => image.title === productName
      );
      return matchedImage
        ? matchedImage.url
        : "https://s.yimg.com/zp/MerchandiseImages/5B660A862A-SP-14819036.jpg";
    };

    // show plan info
    const showPlan = ref([]);
    const showPlanInfo = (index, orderId) => {
      showPlan.value[index] = !showPlan.value[index];
      // Note: this is just a demo, you need to implement your own query api logic by axios
      // http.get("/order/queryPlan?id=" + id).then((response) => {});
    };

    // execute the function when the page is loaded
    onMounted(() => {
      updateTime();
      // set a timer to update the time every minute
      const timer = setInterval(updateTime, 60 * 1000);
      // clear the timer when the page is unmounted
      onUnmounted(() => clearInterval(timer));

      queryOrderInfo();
    });

    // watch the route change and update the time
    watch(
      () => route.path,
      () => {
        updateTime();
      }
    );

    return {
      orderList,
      planList,
      showPlan,
      showPlanInfo,
      getImageSrc,
    };
  },
  data() {
    return {
    };
  },
  methods: {},
};
</script>

<style>
</style>

<template>
  <body class="bg-gray-100">
    <div class="p-3 bg-white" id="app">
      <div
        class="relative top-0 left-0 flex justify-between w-full text-black text-sm"
      >
        <div id="time"></div>
        <div class="flex items-center space-x-1">
          <i class="fas fa-signal"> </i>
          <i class="fas fa-wifi"> </i>
          <i class="fas fa-battery-full"> </i>
          <span> 100% </span>
        </div>
      </div>
      <br />
      <div class="flex items-center mb-4">
        <router-link to="/">
          <i class="fas fa-chevron-left text-xl"> </i>
        </router-link>
        <input
          class="ml-4 flex-grow p-2 border rounded-2xl"
          placeholder="搜索我的订单"
          type="text"
        />
        <i class="fas fa-ellipsis-h text-xl ml-4" @click="goToProductDetail">
        </i>
      </div>
      <div class="flex justify-around mb-4 text-gray-500">
        <div class="text-red-500">全部</div>
        <div>待付款</div>
        <div>待收货/使用</div>
        <div>已完成</div>
        <div>已取消</div>
      </div>
      <div
        class="bg-white p-4 rounded-2xl-lg shadow mb-4"
        v-for="(item, index) in orderList"
        :key="index"
      >
        <div class="flex items-center mb-2">
          <img
            alt="JD logo"
            class="w-6 h-6 mr-2"
            height="24"
            src="https://img13.360buyimg.com/img/jfs/t1/185008/26/33606/2587/641973cbFd5acd3e9/ad0294917f47e6b8.png"
            width="24"
          />
          <div class="flex-grow">Apple产品京东自营旗舰店</div>
          <div class="text-gray-500">完成</div>
        </div>
        <div class="flex mb-2">
          <img
            alt="Logitech M90 mouse"
            class="w-20 h-20 mr-4 object-fill"
            height="80"
            :src="getImageSrc(item.productName)"
            width="80"
          />
          <div class="flex-grow">
            <router-link to="/">
              <div class="text-gray-700">
                {{ item.productName }}
              </div>
            </router-link>
            <div class="text-gray-500">共{{ item.productNum }}件</div>
          </div>
          <div class="text-red-500 text-lg">¥{{ item.orderAmount }}</div>
        </div>
        <div class="flex space-x-4 justify-between" style="font-size: 14px">
          <button
            class="text-gray-500 rounded-2xl px-2 py-1"
            @click="showPlanInfo(index, item.orderId)"
          >
            更多
          </button>
          <div class="flex space-x-4">
            <button
              class="text-gray-500 border border-gray-500 rounded-2xl px-2 py-1"
            >
              退款/售后
            </button>
            <button
              class="text-red-500 border border-red-500 rounded-2xl px-2 py-1"
            >
              再次购买
            </button>
          </div>
        </div>
        <!-- 还款计划 -->
        <div v-if="showPlan[index]" class="mt-4">
          <table class="table-auto w-full text-sm">
            <thead>
              <tr>
                <th class="px-4 py-2">期数</th>
                <th class="px-4 py-2">待还本金</th>
                <th class="px-4 py-2">待还手续费</th>
                <th class="px-4 py-2">最后还款日</th>
              </tr>
            </thead>
            <tbody style="text-align: center">
              <tr v-for="(item, index) in planList" :key="index">
                <td class="px-4 py-2">
                  {{ item.curPlanNum }}/{{ item.planNum }}
                </td>
                <td class="px-4 py-2">{{ item.shouldPayAmount }}</td>
                <td class="px-4 py-2">{{ item.shouldPayPlanFeeAmount }}</td>
                <td class="px-4 py-2">{{ item.limitPayDate }}</td>
              </tr>
              <!-- 可以根据需要添加更多的分期信息 -->
            </tbody>
          </table>
        </div>
      </div>
      <div class="bg-white p-4 rounded-2xl-lg shadow mb-4">
        <div class="flex items-center mb-2">
          <img
            alt="Store logo"
            class="w-6 h-6 mr-2"
            height="24"
            src="https://img13.360buyimg.com/img/jfs/t1/185008/26/33606/2587/641973cbFd5acd3e9/ad0294917f47e6b8.png"
            width="24"
          />
          <div class="flex-grow">丘光食品饮料店</div>
          <div class="text-gray-500">已取消</div>
        </div>
        <div class="flex mb-2">
          <img
            alt="Food item"
            class="w-20 h-20 mr-4"
            height="80"
            src="https://replicate.delivery/yhqm/T874OFt2gFJEDlbLdNjhEALfO2eJ6HRaqXcRgemVkfbonxYNB/out-0.png"
            width="80"
          />
          <div class="flex-grow">
            <div class="text-gray-700">
              良亲宝兜面包早餐软面包整箱零食手撕食品代餐先用后付专区...
            </div>
            <div class="text-gray-500">共1件</div>
          </div>
          <div class="text-red-500 text-lg">¥22.31</div>
        </div>
        <div class="flex justify-end space-x-4" style="font-size: 14px">
          <button
            class="text-gray-500 border border-gray-500 rounded-2xl px-2 py-1"
          >
            删除订单
          </button>
          <div class="flex space-x-4">
            <button
              class="text-gray-500 border border-gray-500 rounded-2xl px-2 py-1"
            >
              钱款去向
            </button>
            <button
              class="text-red-500 border border-red-500 rounded-2xl px-2 py-1"
            >
              再次购买
            </button>
          </div>
        </div>
      </div>
      <div class="bg-white p-4 rounded-2xl-lg shadow mb-4">
        <div class="flex items-center mb-2">
          <img
            alt="Store logo"
            class="w-6 h-6 mr-2"
            height="24"
            src="https://img13.360buyimg.com/img/jfs/t1/185008/26/33606/2587/641973cbFd5acd3e9/ad0294917f47e6b8.png"
            width="24"
          />
          <div class="flex-grow">丘光食品饮料店</div>
          <div class="text-gray-500">已取消</div>
        </div>
        <div class="flex mb-2">
          <img
            alt="Food item"
            class="w-20 h-20 mr-4"
            height="80"
            src="https://replicate.delivery/yhqm/T874OFt2gFJEDlbLdNjhEALfO2eJ6HRaqXcRgemVkfbonxYNB/out-0.png"
            width="80"
          />
          <div class="flex-grow">
            <div class="text-gray-700">
              良亲宝兜面包早餐软面包整箱零食手撕食品代餐先用后付专区...
            </div>
            <div class="text-gray-500">共1件</div>
          </div>
          <div class="text-red-500 text-lg">¥30.65</div>
        </div>
        <div class="flex justify-end space-x-4" style="font-size: 14px">
          <button
            class="text-gray-500 border border-gray-500 rounded-2xl px-2 py-1"
          >
            删除订单
          </button>
          <div class="flex space-x-4">
            <button
              class="text-gray-500 border border-gray-500 rounded-2xl px-2 py-1"
            >
              钱款去向
            </button>
            <button
              class="text-red-500 border border-red-500 rounded-2xl px-2 py-1"
            >
              再次购买
            </button>
          </div>
        </div>
      </div>
      <div class="bg-white p-4 rounded-2xl-lg shadow mb-4">
        <div class="flex items-center mb-2">
          <img
            alt="Store logo"
            class="w-6 h-6 mr-2"
            height="24"
            src="https://img13.360buyimg.com/img/jfs/t1/185008/26/33606/2587/641973cbFd5acd3e9/ad0294917f47e6b8.png"
            width="24"
          />
          <div class="flex-grow">丘光食品饮料店</div>
          <div class="text-gray-500">已取消</div>
        </div>
        <div class="flex mb-2">
          <img
            alt="Food item"
            class="w-20 h-20 mr-4"
            height="80"
            src="https://replicate.delivery/yhqm/T874OFt2gFJEDlbLdNjhEALfO2eJ6HRaqXcRgemVkfbonxYNB/out-0.png"
            width="80"
          />
          <div class="flex-grow">
            <div class="text-gray-700">
              良亲宝兜面包早餐软面包整箱零食手撕食品代餐先用后付专区...
            </div>
            <div class="text-gray-500">共1件</div>
          </div>
          <div class="text-red-500 text-lg">¥34.76</div>
        </div>
        <div class="flex justify-end space-x-4" style="font-size: 14px">
          <button
            class="text-gray-500 border border-gray-500 rounded-2xl px-2 py-1"
          >
            删除订单
          </button>
          <div class="flex space-x-4">
            <button
              class="text-gray-500 border border-gray-500 rounded-2xl px-2 py-1"
            >
              钱款去向
            </button>
            <button
              class="text-red-500 border border-red-500 rounded-2xl px-2 py-1"
            >
              再次购买
            </button>
          </div>
        </div>
      </div>
    </div>
  </body>
</template>
