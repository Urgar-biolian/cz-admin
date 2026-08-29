import { defineApplicationConfig } from "@vben/vite-config";

const apiProxyTarget = process.env.VITE_PROXY_TARGET || "http://localhost:3000";

export default defineApplicationConfig({
  overrides: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            echarts: [
              "echarts",
              "echarts/core",
              "echarts/charts",
              "echarts/components",
              "echarts/renderers",
            ],
            editor: ["tinymce", "codemirror", "vditor"],
            xlsx: ["xlsx", "exceljs", "vxe-table-plugin-export-xlsx"],
            table: ["vxe-table", "xe-utils"],
          },
        },
      },
    },
    optimizeDeps: {
      include: [
        "echarts/core",
        "echarts/charts",
        "echarts/components",
        "echarts/renderers",
        "qrcode",
        "@iconify/iconify",
        "ant-design-vue/es/locale/zh_CN",
        "ant-design-vue/es/locale/en_US",
      ],
    },
    server: {
      proxy: {
        "/basic-api": {
          target: apiProxyTarget,
          changeOrigin: true,
          ws: true,
          rewrite: (path) => path.replace(new RegExp(`^/basic-api`), "/api"),
        },
        "/upload": {
          target: apiProxyTarget,
          changeOrigin: true,
          ws: true,
          rewrite: (path) => path,
        },
      },
      open: false, // 项目启动后，自动打开
      warmup: {
        clientFiles: ["./index.html", "./src/{views,components}/*"],
      },
    },
  },
});
