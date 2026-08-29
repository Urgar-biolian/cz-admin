import { MockMethod } from "vite-plugin-mock";
import { resultSuccess, resultError } from "../_util";

// 模拟获奖者数据
let winners = [
  {
    id: 1,
    name: "张三",
    competition: "蓝桥杯全国软件和信息技术专业人才大赛",
    award: "国一",
    avatar: "https://via.placeholder.com/40x40/87CEEB/000000?text=张",
    createdAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: 2,
    name: "李四",
    competition: "蓝桥杯全国软件和信息技术专业人才大赛",
    award: "国二",
    avatar: "https://via.placeholder.com/40x40/98FB98/000000?text=李",
    createdAt: "2024-01-02T00:00:00.000Z",
  },
  {
    id: 3,
    name: "王五",
    competition: "蓝桥杯全国软件和信息技术专业人才大赛",
    award: "国三",
    avatar: "https://via.placeholder.com/40x40/DDA0DD/000000?text=王",
    createdAt: "2024-01-03T00:00:00.000Z",
  },
  {
    id: 4,
    name: "赵六",
    competition: "蓝桥杯全国软件和信息技术专业人才大赛",
    award: "省一",
    avatar: "https://via.placeholder.com/40x40/F0E68C/000000?text=赵",
    createdAt: "2024-01-04T00:00:00.000Z",
  },
  {
    id: 5,
    name: "钱七",
    competition: "蓝桥杯全国软件和信息技术专业人才大赛",
    award: "省二",
    avatar: "https://via.placeholder.com/40x40/FFB6C1/000000?text=钱",
    createdAt: "2024-01-05T00:00:00.000Z",
  },
];

export default [
  // 获取所有获奖者
  {
    url: "/api/winners",
    method: "get",
    response: () => {
      return resultSuccess(winners);
    },
  },

  // 分页获取获奖者
  {
    url: "/api/winners/page",
    method: "get",
    response: ({ query }) => {
      const { page = 1, pageSize = 10, name, competition, award } = query;
      let filteredWinners = [...winners];

      // 筛选逻辑
      if (name) {
        filteredWinners = filteredWinners.filter((item) =>
          item.name.includes(name),
        );
      }
      if (competition) {
        filteredWinners = filteredWinners.filter((item) =>
          item.competition.includes(competition),
        );
      }
      if (award) {
        filteredWinners = filteredWinners.filter(
          (item) => item.award === award,
        );
      }

      const total = filteredWinners.length;
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const pageWinners = filteredWinners.slice(start, end);

      return resultSuccess({
        winners: pageWinners,
        total,
        page: parseInt(page),
        pageSize: parseInt(pageSize),
        totalPages: Math.ceil(total / pageSize),
      });
    },
  },

  // 根据ID获取获奖者详情
  {
    url: "/api/winners/:id",
    method: "get",
    response: ({ params }) => {
      const { id } = params;
      const winner = winners.find((item) => item.id === parseInt(id));
      if (!winner) {
        return resultError("获奖者不存在");
      }
      return resultSuccess(winner);
    },
  },

  // 创建获奖者
  {
    url: "/api/winners",
    method: "post",
    response: ({ body }) => {
      const { name, competition, award, avatar } = body;
      if (!name || !competition || !award) {
        return resultError("请填写完整信息");
      }

      const newWinner = {
        id: Math.max(...winners.map((w) => w.id)) + 1,
        name,
        competition,
        award,
        avatar:
          avatar ||
          `https://via.placeholder.com/40x40/87CEEB/000000?text=${name.charAt(0)}`,
        createdAt: new Date().toISOString(),
      };

      winners.push(newWinner);
      return resultSuccess(newWinner);
    },
  },

  // 批量创建获奖者
  {
    url: "/api/winners/batch",
    method: "post",
    response: ({ body }) => {
      const newWinners = body.map((item: any) => {
        const { name, competition, award, avatar } = item;
        return {
          id: Math.max(...winners.map((w) => w.id)) + 1,
          name,
          competition,
          award,
          avatar:
            avatar ||
            `https://via.placeholder.com/40x40/87CEEB/000000?text=${name.charAt(0)}`,
          createdAt: new Date().toISOString(),
        };
      });

      winners.push(...newWinners);
      return resultSuccess({
        count: newWinners.length,
        message: `成功创建 ${newWinners.length} 条获奖者记录`,
      });
    },
  },

  // 更新获奖者信息
  {
    url: "/api/winners/:id",
    method: "put",
    response: ({ params, body }) => {
      const { id } = params;
      const winnerIndex = winners.findIndex((item) => item.id === parseInt(id));

      if (winnerIndex === -1) {
        return resultError("获奖者不存在");
      }

      const updatedWinner = { ...winners[winnerIndex], ...body };
      winners[winnerIndex] = updatedWinner;

      return resultSuccess(updatedWinner);
    },
  },

  // 删除获奖者
  {
    url: "/api/winners/:id",
    method: "delete",
    response: ({ params }) => {
      const { id } = params;
      const winnerIndex = winners.findIndex((item) => item.id === parseInt(id));

      if (winnerIndex === -1) {
        return resultError("获奖者不存在");
      }

      winners.splice(winnerIndex, 1);
      return resultSuccess(null);
    },
  },

  // 批量删除获奖者
  {
    url: "/api/winners/batch",
    method: "delete",
    response: ({ body }) => {
      const { ids } = body;
      const deletedCount = ids.length;

      winners = winners.filter((item) => !ids.includes(item.id));

      return resultSuccess({
        count: deletedCount,
        message: `成功删除 ${deletedCount} 条获奖者记录`,
      });
    },
  },

  // 按获奖等级筛选
  {
    url: "/api/winners/filter/award",
    method: "get",
    response: ({ query }) => {
      const { award } = query;
      const filteredWinners = winners.filter((item) => item.award === award);
      return resultSuccess(filteredWinners);
    },
  },

  // 按比赛名称筛选
  {
    url: "/api/winners/filter/competition",
    method: "get",
    response: ({ query }) => {
      const { competition } = query;
      const filteredWinners = winners.filter((item) =>
        item.competition.includes(competition),
      );
      return resultSuccess(filteredWinners);
    },
  },

  // 获取统计数据
  {
    url: "/api/winners/stats",
    method: "get",
    response: () => {
      const totalWinners = winners.length;

      // 按获奖等级统计
      const awardStats = [
        {
          award: "国一",
          _count: { award: winners.filter((w) => w.award === "国一").length },
        },
        {
          award: "国二",
          _count: { award: winners.filter((w) => w.award === "国二").length },
        },
        {
          award: "国三",
          _count: { award: winners.filter((w) => w.award === "国三").length },
        },
        {
          award: "省一",
          _count: { award: winners.filter((w) => w.award === "省一").length },
        },
        {
          award: "省二",
          _count: { award: winners.filter((w) => w.award === "省二").length },
        },
      ];

      // 按比赛名称统计
      const competitionStats = [
        {
          competition: "蓝桥杯全国软件和信息技术专业人才大赛",
          _count: {
            competition: winners.filter(
              (w) => w.competition === "蓝桥杯全国软件和信息技术专业人才大赛",
            ).length,
          },
        },
      ];

      return resultSuccess({
        totalWinners,
        awardStats,
        competitionStats,
      });
    },
  },

  // 文件上传
  {
    url: "/api/upload",
    method: "post",
    response: () => {
      return resultSuccess({
        url: "https://via.placeholder.com/40x40/87CEEB/000000?text=头像",
      });
    },
  },
  // 文件上传（与后端保持一致的新路径）
  {
    url: "/api/upload/image",
    method: "post",
    response: () => {
      return resultSuccess({
        url: "https://via.placeholder.com/40x40/87CEEB/000000?text=头像",
      });
    },
  },
] as MockMethod[];
