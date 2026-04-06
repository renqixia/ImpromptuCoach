export interface Question {
  id: number;
  category: string;
  text: string;
  tips?: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export const CATEGORIES = [
  "亲子“火线”实战",
  "教练觉察与专业修身",
  "逻辑表达与个人成长",
  "随机“黑天鹅”挑战"
];

export const DIFFICULTIES = [
  { id: 'Beginner', name: '入门 (3分钟)', time: 180 },
  { id: 'Intermediate', name: '进阶 (2分钟)', time: 120 },
  { id: 'Advanced', name: '挑战 (1分钟)', time: 60 }
];

export const FRAMEWORKS = {
  "4F": "事实 (Fact)、感受 (Feeling)、发现 (Finding)、未来 (Future)",
  "PREP": "观点 (Point)、理由 (Reason)、案例 (Example)、总结 (Point)",
  "GROW": "目标 (Goal)、现状 (Reality)、选择 (Options)、意愿 (Will)",
  "冰山": "行为、应对方式、感受、观点、期待、渴望、自我",
  "情感连接": "看见、接纳、共情、支持"
};

export const QUESTIONS: Question[] = [
  // 1. 亲子“火线”实战 (35题)
  { id: 1, category: "亲子“火线”实战", text: "孩子说：‘妈妈，我讨厌写作业，那是给老师写的。’ 请进行即兴回应。", tips: ["4F", "情感连接"], difficulty: 'Beginner' },
  { id: 2, category: "亲子“火线”实战", text: "孩子考试考了全班垫底，面对他沮丧的神情，你如何开启第一次‘冰山对话’？", tips: ["冰山", "GROW"], difficulty: 'Beginner' },
  { id: 3, category: "亲子“火线”实战", text: "当孩子在超市因为买不到玩具大哭大闹，如何通过‘情感连接’而非‘制止’来演讲？", tips: ["情感连接", "4F"], difficulty: 'Beginner' },
  { id: 4, category: "亲子“火线”实战", text: "如何向一个 10 岁的孩子解释什么是‘因果思维’？", tips: ["PREP"], difficulty: 'Intermediate' },
  { id: 5, category: "亲子“火线”实战", text: "孩子想放弃已经坚持三年的钢琴，作为教练型家长，你会如何通过提问引导他？", tips: ["GROW", "冰山"], difficulty: 'Intermediate' },
  { id: 6, category: "亲子“火线”实战", text: "孩子在学校和同学打架了，回家后一言不发，你如何打破僵局？", tips: ["4F", "情感连接"], difficulty: 'Intermediate' },
  { id: 7, category: "亲子“火线”实战", text: "孩子沉迷手机游戏，拒绝参加家庭聚餐，你该如何沟通？", tips: ["GROW", "冰山"], difficulty: 'Intermediate' },
  { id: 8, category: "亲子“火线”实战", text: "孩子问：‘为什么我要听你的？’ 请给出一个教练式的回答。", tips: ["PREP", "冰山"], difficulty: 'Advanced' },
  { id: 9, category: "亲子“火线”实战", text: "孩子想买一件超出家庭预算的名牌衣服，你如何引导他的金钱观？", tips: ["GROW", "4F"], difficulty: 'Intermediate' },
  { id: 10, category: "亲子“火线”实战", text: "孩子在公共场合大声喧哗，你如何优雅地进行‘教练式干预’？", tips: ["情感连接", "4F"], difficulty: 'Beginner' },
  { id: 11, category: "亲子“火线”实战", text: "孩子说：‘我不想上学了，学校太无聊。’ 你如何探寻他背后的需求？", tips: ["冰山", "GROW"], difficulty: 'Intermediate' },
  { id: 12, category: "亲子“火线”实战", text: "孩子弄坏了邻居家的窗户，你如何引导他承担责任？", tips: ["4F", "GROW"], difficulty: 'Beginner' },
  { id: 13, category: "亲子“火线”实战", text: "孩子因为没被选上校队而大哭，你如何安慰并激励他？", tips: ["情感连接", "4F"], difficulty: 'Beginner' },
  { id: 14, category: "亲子“火线”实战", text: "孩子偷偷拿了家里的钱，你发现后该如何进行一次‘不带评判’的谈话？", tips: ["冰山", "4F"], difficulty: 'Advanced' },
  { id: 15, category: "亲子“火线”实战", text: "孩子问：‘人为什么要努力？’ 请用教练视角回答。", tips: ["PREP", "GROW"], difficulty: 'Intermediate' },
  { id: 16, category: "亲子“火线”实战", text: "孩子在饭桌上挑食，你如何通过提问让他意识到营养的重要性？", tips: ["GROW"], difficulty: 'Beginner' },
  { id: 17, category: "亲子“火线”实战", text: "孩子和最好的朋友吵架了，非常伤心，你如何帮他复盘？", tips: ["4F", "情感连接"], difficulty: 'Beginner' },
  { id: 18, category: "亲子“火线”实战", text: "孩子想养宠物，但你担心他无法坚持照顾，你如何和他达成‘契约’？", tips: ["GROW", "4F"], difficulty: 'Intermediate' },
  { id: 19, category: "亲子“火线”实战", text: "孩子考试作弊被抓，你如何处理这次危机并转化为成长契机？", tips: ["冰山", "4F"], difficulty: 'Advanced' },
  { id: 20, category: "亲子“火线”实战", text: "孩子说：‘我长大了想当网红，不想读书。’ 你如何回应？", tips: ["PREP", "GROW"], difficulty: 'Intermediate' },
  { id: 21, category: "亲子“火线”实战", text: "孩子因为老师的批评而产生厌学情绪，你如何帮他疏导？", tips: ["情感连接", "冰山"], difficulty: 'Intermediate' },
  { id: 22, category: "亲子“火线”实战", text: "孩子在比赛中输了，表现得很愤怒，你如何引导他面对失败？", tips: ["4F", "情感连接"], difficulty: 'Beginner' },
  { id: 23, category: "亲子“火线”实战", text: "孩子想在周末熬夜看电影，你如何和他商量作息时间？", tips: ["GROW", "4F"], difficulty: 'Beginner' },
  { id: 24, category: "亲子“火线”实战", text: "孩子问：‘爸爸，你爱我吗？’ 请给出一个深情的教练式回应。", tips: ["情感连接", "冰山"], difficulty: 'Beginner' },
  { id: 25, category: "亲子“火线”实战", text: "孩子在学校被排挤，回家后情绪低落，你如何支持他？", tips: ["冰山", "情感连接"], difficulty: 'Intermediate' },
  { id: 26, category: "亲子“火线”实战", text: "孩子想尝试一项危险的运动，你如何引导他评估风险？", tips: ["GROW", "PREP"], difficulty: 'Intermediate' },
  { id: 27, category: "亲子“火线”实战", text: "孩子说：‘我真笨，什么都做不好。’ 你如何重塑他的自信？", tips: ["情感连接", "4F"], difficulty: 'Beginner' },
  { id: 28, category: "亲子“火线”实战", text: "孩子因为搬家要离开好朋友，非常焦虑，你如何帮他适应变化？", tips: ["4F", "冰山"], difficulty: 'Intermediate' },
  { id: 29, category: "亲子“火线”实战", text: "孩子在超市偷吃东西，你发现后该如何教育？", tips: ["冰山", "4F"], difficulty: 'Advanced' },
  { id: 30, category: "亲子“火线”实战", text: "孩子问：‘死是什么意思？’ 你如何进行生命教育？", tips: ["PREP", "情感连接"], difficulty: 'Advanced' },
  { id: 31, category: "亲子“火线”实战", text: "孩子想把零花钱全部捐给乞丐，你如何引导他的善意？", tips: ["GROW", "4F"], difficulty: 'Beginner' },
  { id: 32, category: "亲子“火线”实战", text: "孩子因为作业多而发脾气摔东西，你如何冷处理并引导？", tips: ["情感连接", "4F"], difficulty: 'Intermediate' },
  { id: 33, category: "亲子“火线”实战", text: "孩子说：‘我讨厌那个新来的弟弟/妹妹。’ 你如何处理同胞竞争？", tips: ["冰山", "情感连接"], difficulty: 'Intermediate' },
  { id: 34, category: "亲子“火线”实战", text: "孩子想在暑假去打工，你如何支持并引导他的职业初体验？", tips: ["GROW", "PREP"], difficulty: 'Intermediate' },
  { id: 35, category: "亲子“火线”实战", text: "孩子问：‘为什么我们要保护环境？’ 请用教练思维解释。", tips: ["PREP", "4F"], difficulty: 'Intermediate' },

  // 2. 教练觉察与专业修身 (35题)
  { id: 36, category: "教练觉察与专业修身", text: "如果‘建议’是教练的毒药，请演讲：如何克制住想给孩子出主意的冲动？", tips: ["冰山", "PREP"], difficulty: 'Intermediate' },
  { id: 37, category: "教练觉察与专业修身", text: "用 4F 法（事实、感受、发现、未来）复盘你最近一次失败的亲子沟通。", tips: ["4F"], difficulty: 'Beginner' },
  { id: 38, category: "教练觉察与专业修身", text: "如何用‘冰山模型’解读一个‘总是爱撒谎’的孩子？", tips: ["冰山"], difficulty: 'Intermediate' },
  { id: 39, category: "教练觉察与专业修身", text: "演讲题目：‘在教练对话中，倾听比提问更重要的理由。’", tips: ["PREP", "冰山"], difficulty: 'Intermediate' },
  { id: 40, category: "教练觉察与专业修身", text: "当客户（或配偶）对你产生强烈的负面情绪，你如何保持‘中立’与‘觉察’？", tips: ["冰山", "4F"], difficulty: 'Advanced' },
  { id: 41, category: "教练觉察与专业修身", text: "演讲题目：‘教练的无知状态（Not-Knowing State）对对话的价值。’", tips: ["PREP"], difficulty: 'Advanced' },
  { id: 42, category: "教练觉察与专业修身", text: "如何区分‘真问题’与‘假问题’？请分享你的教练心得。", tips: ["GROW", "冰山"], difficulty: 'Advanced' },
  { id: 43, category: "教练觉察与专业修身", text: "演讲题目：‘为什么教练型家长需要先修身，再齐家？’", tips: ["PREP", "冰山"], difficulty: 'Intermediate' },
  { id: 44, category: "教练觉察与专业修身", text: "当你在对话中感到焦虑，你如何通过呼吸找回‘教练状态’？", tips: ["4F", "情感连接"], difficulty: 'Beginner' },
  { id: 45, category: "教练觉察与专业修身", text: "解释：为什么‘强有力提问’通常是开放式的？", tips: ["PREP", "GROW"], difficulty: 'Beginner' },
  { id: 46, category: "教练觉察与专业修身", text: "分享一次你通过‘觉察’化解冲突的真实经历。", tips: ["4F", "冰山"], difficulty: 'Intermediate' },
  { id: 47, category: "教练觉察与专业修身", text: "演讲题目：‘教练对话中的沉默，是金子还是尴尬？’", tips: ["PREP", "情感连接"], difficulty: 'Intermediate' },
  { id: 48, category: "教练觉察与专业修身", text: "如何避免在教练过程中变成‘说教者’？", tips: ["冰山", "GROW"], difficulty: 'Beginner' },
  { id: 49, category: "教练觉察与专业修身", text: "演讲题目：‘看见他人的力量：从控制到赋能。’", tips: ["PREP", "情感连接"], difficulty: 'Intermediate' },
  { id: 50, category: "教练觉察与专业修身", text: "当你的价值观与孩子发生冲突，你如何保持教练的‘好奇心’？", tips: ["冰山", "4F"], difficulty: 'Advanced' },
  { id: 51, category: "教练觉察与专业修身", text: "解释：什么是教练中的‘同频共振’？", tips: ["情感连接", "PREP"], difficulty: 'Intermediate' },
  { id: 52, category: "教练觉察与专业修身", text: "演讲题目：‘放下期待，才能遇见真实的对方。’", tips: ["冰山", "PREP"], difficulty: 'Advanced' },
  { id: 53, category: "教练觉察与专业修身", text: "如何通过‘积极反馈’（Praise）提升孩子的自我效能感？", tips: ["4F", "GROW"], difficulty: 'Beginner' },
  { id: 54, category: "教练觉察与专业修身", text: "演讲题目：‘教练型家长的情绪稳定，是家庭最好的风水。’", tips: ["PREP", "冰山"], difficulty: 'Intermediate' },
  { id: 55, category: "教练觉察与专业修身", text: "当对话陷入僵局，你如何通过‘重构’（Reframing）寻找转机？", tips: ["GROW", "4F"], difficulty: 'Advanced' },
  { id: 56, category: "教练觉察与专业修身", text: "解释：为什么教练不提供答案，而是提供镜子？", tips: ["PREP", "冰山"], difficulty: 'Intermediate' },
  { id: 57, category: "教练觉察与专业修身", text: "演讲题目：‘在教练中，如何做到真正的‘不带评判’？’", tips: ["冰山", "4F"], difficulty: 'Advanced' },
  { id: 58, category: "教练觉察与专业修身", text: "分享你对‘教练位置’（Coaching Position）的理解。", tips: ["PREP"], difficulty: 'Advanced' },
  { id: 59, category: "教练觉察与专业修身", text: "如何通过‘直觉’捕捉对话中的微小信号？", tips: ["情感连接", "冰山"], difficulty: 'Advanced' },
  { id: 60, category: "教练觉察与专业修身", text: "演讲题目：‘教练型家长的自我关怀：先照顾好自己。’", tips: ["4F", "PREP"], difficulty: 'Beginner' },
  { id: 61, category: "教练觉察与专业修身", text: "解释：什么是教练中的‘契约’（Contracting）？", tips: ["GROW", "PREP"], difficulty: 'Intermediate' },
  { id: 62, category: "教练觉察与专业修身", text: "演讲题目：‘从‘为什么’到‘怎么做’：思维方式的转变。’", tips: ["PREP", "GROW"], difficulty: 'Intermediate' },
  { id: 63, category: "教练觉察与专业修身", text: "当孩子拒绝沟通，你如何通过‘陪伴’建立安全感？", tips: ["情感连接", "冰山"], difficulty: 'Beginner' },
  { id: 64, category: "教练觉察与专业修身", text: "演讲题目：‘教练的同理心：走进对方的意愿里。’", tips: ["情感连接", "4F"], difficulty: 'Intermediate' },
  { id: 65, category: "教练觉察与专业修身", text: "如何通过‘隐喻’让教练对话更生动有效？", tips: ["PREP", "冰山"], difficulty: 'Advanced' },
  { id: 66, category: "教练觉察与专业修身", text: "演讲题目：‘教练型家长的‘退后一步’：给孩子成长的空间。’", tips: ["PREP", "GROW"], difficulty: 'Intermediate' },
  { id: 67, category: "教练觉察与专业修身", text: "解释：什么是教练中的‘挑战’（Challenge）？", tips: ["GROW", "4F"], difficulty: 'Intermediate' },
  { id: 68, category: "教练觉察与专业修身", text: "演讲题目：‘教练对话后的行动跟进：让改变发生。’", tips: ["GROW", "4F"], difficulty: 'Beginner' },
  { id: 69, category: "教练觉察与专业修身", text: "分享你对‘教练核心能力’中‘建立信任’的看法。", tips: ["情感连接", "PREP"], difficulty: 'Beginner' },
  { id: 70, category: "教练觉察与专业修身", text: "演讲题目：‘终身教练：将教练技术融入生命。’", tips: ["PREP", "冰山"], difficulty: 'Advanced' },

  // 3. 逻辑表达与个人成长 (30题)
  { id: 71, category: "逻辑表达与个人成长", text: "为什么说‘教育的本质是点燃，而不是灌输’？请用 PREP 结构论述。", tips: ["PREP"], difficulty: 'Beginner' },
  { id: 72, category: "逻辑表达与个人成长", text: "如果你能穿越回孩子出生那天，你会对他/她进行一段怎样的 3 分钟寄语？", tips: ["情感连接", "4F"], difficulty: 'Beginner' },
  { id: 73, category: "逻辑表达与个人成长", text: "用‘过去-现在-未来’模型，讲述你成为教练型家长的转变过程。", tips: ["4F", "GROW"], difficulty: 'Intermediate' },
  { id: 74, category: "逻辑表达与个人成长", text: "演讲题目：‘终身学习者’对一个家庭最大的意义是什么？", tips: ["PREP"], difficulty: 'Beginner' },
  { id: 75, category: "逻辑表达与个人成长", text: "解释：为什么‘看见’比‘解决问题’更有力量？", tips: ["冰山", "情感连接"], difficulty: 'Intermediate' },
  { id: 76, category: "逻辑表达与个人成长", text: "演讲题目：‘温柔而坚定’：我的育儿信条。", tips: ["PREP", "4F"], difficulty: 'Beginner' },
  { id: 77, category: "逻辑表达与个人成长", text: "分享一个影响你最深的教练故事。", tips: ["4F", "情感连接"], difficulty: 'Intermediate' },
  { id: 78, category: "逻辑表达与个人成长", text: "演讲题目：‘失败的价值：给孩子试错的权利。’", tips: ["PREP", "GROW"], difficulty: 'Intermediate' },
  { id: 79, category: "逻辑表达与个人成长", text: "如何平衡‘家长的权威’与‘教练的平等’？", tips: ["冰山", "4F"], difficulty: 'Advanced' },
  { id: 80, category: "逻辑表达与个人成长", text: "演讲题目：‘我的教练之路：从焦虑到从容。’", tips: ["4F", "冰山"], difficulty: 'Intermediate' },
  { id: 81, category: "逻辑表达与个人成长", text: "解释：什么是‘成长型思维’？", tips: ["PREP", "GROW"], difficulty: 'Beginner' },
  { id: 82, category: "逻辑表达与个人成长", text: "演讲题目：‘家庭中的非暴力沟通。’", tips: ["4F", "情感连接"], difficulty: 'Intermediate' },
  { id: 83, category: "逻辑表达与个人成长", text: "分享你对‘父母是孩子的第一任老师’的新理解。", tips: ["PREP", "冰山"], difficulty: 'Intermediate' },
  { id: 84, category: "逻辑表达与个人成长", text: "演讲题目：‘活在当下：教练型家长的生活态度。’", tips: ["4F", "情感连接"], difficulty: 'Intermediate' },
  { id: 85, category: "逻辑表达与个人成长", text: "如何通过‘讲故事’提升你的演讲影响力？", tips: ["PREP"], difficulty: 'Advanced' },
  { id: 86, category: "逻辑表达与个人成长", text: "演讲题目：‘感恩：家庭幸福的基石。’", tips: ["4F", "情感连接"], difficulty: 'Beginner' },
  { id: 87, category: "逻辑表达与个人成长", text: "分享一次你克服演讲恐惧的经历。", tips: ["4F", "PREP"], difficulty: 'Beginner' },
  { id: 88, category: "逻辑表达与个人成长", text: "演讲题目：‘自律与自由：给孩子的最好礼物。’", tips: ["PREP", "GROW"], difficulty: 'Intermediate' },
  { id: 89, category: "逻辑表达与个人成长", text: "如何用‘逻辑思维’解决家庭矛盾？", tips: ["GROW", "4F"], difficulty: 'Advanced' },
  { id: 90, category: "逻辑表达与个人成长", text: "演讲题目：‘我的梦想家庭：教练技术的终极目标。’", tips: ["GROW", "情感连接"], difficulty: 'Intermediate' },
  { id: 91, category: "逻辑表达与个人成长", text: "解释：什么是‘心理韧性’？", tips: ["PREP", "4F"], difficulty: 'Intermediate' },
  { id: 92, category: "逻辑表达与个人成长", text: "演讲题目：‘阅读：拓宽生命的边界。’", tips: ["PREP"], difficulty: 'Beginner' },
  { id: 93, category: "逻辑表达与个人成长", text: "分享你对‘幸福’的定义。", tips: ["冰山", "4F"], difficulty: 'Advanced' },
  { id: 94, category: "逻辑表达与个人成长", text: "演讲题目：‘勇气：面对真实的自我。’", tips: ["冰山", "情感连接"], difficulty: 'Advanced' },
  { id: 95, category: "逻辑表达与个人成长", text: "如何通过‘写作’梳理你的教练思考？", tips: ["4F", "PREP"], difficulty: 'Intermediate' },
  { id: 96, category: "逻辑表达与个人成长", text: "演讲题目：‘时间管理：平衡事业与家庭。’", tips: ["GROW", "4F"], difficulty: 'Intermediate' },
  { id: 97, category: "逻辑表达与个人成长", text: "分享一个你最喜欢的教练金句。", tips: ["PREP", "情感连接"], difficulty: 'Beginner' },
  { id: 98, category: "逻辑表达与个人成长", text: "演讲题目：‘沟通的艺术：听懂言外之意。’", tips: ["冰山", "情感连接"], difficulty: 'Advanced' },
  { id: 99, category: "逻辑表达与个人成长", text: "如何培养孩子的‘好奇心’？", tips: ["GROW", "4F"], difficulty: 'Beginner' },
  { id: 100, category: "逻辑表达与个人成长", text: "演讲题目：‘我的成长宣言。’", tips: ["4F", "GROW"], difficulty: 'Beginner' },

  // 4. 随机“黑天鹅”挑战 (15题)
  { id: 101, category: "随机“黑天鹅”挑战", text: "假如你现在是一位失败学教授，请给家长们做一场关于‘失败的艺术’的即兴演讲。", tips: ["PREP", "4F"], difficulty: 'Advanced' },
  { id: 102, category: "随机“黑天鹅”挑战", text: "如果情绪是一个人，你会如何与你的‘愤怒’进行一场深谈？", tips: ["冰山", "情感连接"], difficulty: 'Advanced' },
  { id: 103, category: "随机“黑天鹅”挑战", text: "假如你是一棵树，请描述你眼中的‘家庭森林’。", tips: ["情感连接", "4F"], difficulty: 'Advanced' },
  { id: 104, category: "随机“黑天鹅”挑战", text: "如果时间可以倒流，你最想改变哪一个‘教练时刻’？", tips: ["4F", "冰山"], difficulty: 'Advanced' },
  { id: 105, category: "随机“黑天鹅”挑战", text: "假如你是孩子的影子，请演讲：‘我看见的那个真实的他。’", tips: ["冰山", "情感连接"], difficulty: 'Advanced' },
  { id: 106, category: "随机“黑天鹅”挑战", text: "如果教练技术是一种超能力，你最想用它解决什么世界难题？", tips: ["PREP", "GROW"], difficulty: 'Advanced' },
  { id: 107, category: "随机“黑天鹅”挑战", text: "假如你正在主持一场‘家庭吐槽大会’，你如何用教练思维收场？", tips: ["4F", "GROW"], difficulty: 'Advanced' },
  { id: 108, category: "随机“黑天鹅”挑战", text: "如果你的心是一个房间，请描述里面的‘教练角落’。", tips: ["情感连接", "冰山"], difficulty: 'Advanced' },
  { id: 109, category: "随机“黑天鹅”挑战", text: "假如你是一本书，请为你的‘教练篇章’写一段导言。", tips: ["PREP", "4F"], difficulty: 'Advanced' },
  { id: 110, category: "随机“黑天鹅”挑战", text: "如果今天是你生命的最后一天，请对你的教练学员（或孩子）说最后一段话。", tips: ["情感连接", "4F"], difficulty: 'Advanced' },
  { id: 111, category: "随机“黑天鹅”挑战", text: "突然停电了，全家人在黑暗中坐在一起，你如何开启一段‘教练式夜话’？", tips: ["情感连接", "4F"], difficulty: 'Beginner' },
  { id: 112, category: "随机“黑天鹅”挑战", text: "如果不允许使用任何‘提问’，你如何通过‘回应’来展现教练状态？", tips: ["情感连接", "冰山"], difficulty: 'Intermediate' },
  { id: 113, category: "随机“黑天鹅”挑战", text: "假如你正在参加一场‘完美家长’的葬礼，请致悼词。", tips: ["PREP", "4F"], difficulty: 'Advanced' },
  { id: 114, category: "随机“黑天鹅”挑战", text: "如果你的孩子突然变成了你的教练，他会问你什么问题？你如何回答？", tips: ["GROW", "冰山"], difficulty: 'Intermediate' },
  { id: 115, category: "随机“黑天鹅”挑战", text: "假如你必须用一种‘动物’来形容你现在的教练状态，你会选什么？为什么？", tips: ["4F", "PREP"], difficulty: 'Beginner' }
];
