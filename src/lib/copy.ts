export type HomeCopySet = {
  heroTitle: string;
  heroSubtitle: string;
  actionTitle: string;
  actionDescription: string;
  sideTitle: string;
  sideQuote: string;
};

export type StartCopySet = {
  title: string;
  subtitle: string;
  helper: string;
};

export type RecordsCopySet = {
  title: string;
  subtitle: string;
  cta: string;
  timelineTitle: string;
  emptyTitle: string;
  emptyDescription: string;
};

export type SessionCopySet = {
  title: string;
  subtitle: string;
  finishLabel: string;
  cancelLabel: string;
};

export type DoneCopySet = {
  title: string;
  subtitle: string;
  viewLabel: string;
  restartLabel: string;
};

export const homeCopySets: HomeCopySet[] = [
  {
    heroTitle: "把今天过成有痕迹的一天",
    heroSubtitle:
      "不是把时间塞满，而是让它落地。每一次开始，都为今天留下清晰的一笔；到了夜里，你也能平静地看见，这一天究竟去向了哪里。",
    actionTitle: "从这一刻开始，给时间留名",
    actionDescription:
      "首页只保留最重要的两个动作：开始一段新的专注，或者走进完整记录页，回看今天已经留下的轨迹。",
    sideTitle: "入口始终在眼前",
    sideQuote: "让开始更轻，让回看更深。",
  },
  {
    heroTitle: "让时间不再只是流过去",
    heroSubtitle:
      "你不必把一天解释得轰轰烈烈。只要愿意认真开始一次，它就会慢慢显影，变成你能够回头辨认的样子。",
    actionTitle: "先专注一段，再让它被看见",
    actionDescription:
      "当开始足够轻，记录就会自然发生。你只需要决定此刻要做什么，剩下的轨迹，会由今天替你保存下来。",
    sideTitle: "入口始终在眼前",
    sideQuote: "把注意力交给当下，把回看留给夜里。",
  },
  {
    heroTitle: "为今天留下一点清晰",
    heroSubtitle:
      "有些日子并不喧哗，却值得被好好记住。每一次专注，都是把散开的时间，轻轻收拢成一条能看见的线。",
    actionTitle: "给当下一个名字，再按下开始",
    actionDescription:
      "首页只做两件事：送你进入下一段专注，或者带你回到完整记录页，看见时间究竟如何被使用。",
    sideTitle: "入口始终在眼前",
    sideQuote: "少一点寻找入口，多一点认真开始。",
  },
  {
    heroTitle: "把一天写成可回看的轨迹",
    heroSubtitle:
      "时间不一定需要热闹地证明自己。它也可以安静地留下痕迹，让你在一天结束时，仍然知道自己曾认真地生活过。",
    actionTitle: "开始一段专注，也开始一段记录",
    actionDescription:
      "这里不再堆满长长的列表。它只保留最清晰的两个动作，让开始更直接，让回看更完整。",
    sideTitle: "入口始终在眼前",
    sideQuote: "先向前一步，再回头看见全貌。",
  },
];

export const startCopySets: StartCopySet[] = [
  {
    title: "开始一次专注",
    subtitle: "写下你现在要做的事。这段时间不会消失，它会成为今天的一条记录。",
    helper: "开始后将自动记录开始时间。结束后，这次专注会出现在今天的时间轴里。",
  },
  {
    title: "给这段时间一个名字",
    subtitle: "不用想得太多，只要把当下要做的事写下来，然后认真开始这一段。",
    helper: "你只负责开始。时间会被安静地记住，等你结束时，它就会留在今天的轨迹里。",
  },
  {
    title: "把注意力放进这一刻",
    subtitle: "先写下此刻要做的事，再按下开始。剩下的，让时间自己慢慢成形。",
    helper: "开始后会自动记下起点。等这一段结束，今天就会多出一条清晰的记录。",
  },
  {
    title: "从一件事开始，让今天显影",
    subtitle: "有时只要认真开始一次，一整天都会慢慢变得清晰。",
    helper: "这不是普通倒计时。它会把这一段专注留在今天，等你回头时仍能看见。",
  },
];

export const recordsCopySets: RecordsCopySet[] = [
  {
    title: "今天的完整记录",
    subtitle: "这里专门用来回看时间轨迹。首页负责开始，而这一页负责把今天慢慢展开。",
    cta: "开始新的记录",
    timelineTitle: "完整时间轴",
    emptyTitle: "还没有可查看的记录",
    emptyDescription: "先开始一段新的专注。完成后，这里会出现你今天所有留下的时间轨迹。",
  },
  {
    title: "把今天一条一条看清楚",
    subtitle: "那些当下认真过的片刻，都会在这里排成一条线。你不必回忆，它们已经替你留下来了。",
    cta: "开始下一段专注",
    timelineTitle: "今日轨迹",
    emptyTitle: "今天还没有展开",
    emptyDescription: "先开始第一段专注吧。等它结束之后，今天的轨迹会从这里慢慢显现出来。",
  },
  {
    title: "今天去向了哪里",
    subtitle: "这一页不催促你开始，只安静地把已经发生过的时间摆在眼前，让你看见它们真正落到了哪里。",
    cta: "再开始一段",
    timelineTitle: "完整回看",
    emptyTitle: "还没有轨迹可回看",
    emptyDescription: "先去留下第一条记录。等你回来时，这里会把今天认真发生过的事排成清晰的顺序。",
  },
];

export const sessionCopySets: SessionCopySet[] = [
  {
    title: "正在专注",
    subtitle: "你正在为今天留下一条新的记录。现在，只需要安静地待在这件事里。",
    finishLabel: "结束并保存",
    cancelLabel: "取消这次记录",
  },
  {
    title: "把这一段认真过完",
    subtitle: "别急着看结果，先把这几分钟安稳地交给眼前这件事。等你结束时，今天会多出一条清晰的轨迹。",
    finishLabel: "完成并记下",
    cancelLabel: "放弃这次记录",
  },
  {
    title: "此刻正在成形",
    subtitle: "时间正安静地流过你手边。你只需要留在这里，它自然会被写进今天。",
    finishLabel: "保存这段专注",
    cancelLabel: "取消本次开始",
  },
];

export const doneCopySets: DoneCopySet[] = [
  {
    title: "已记录这段时间",
    subtitle: "今天的时间轨迹，又多了一段。刚刚那段专注没有消失，它已经成为今天的一部分。",
    viewLabel: "查看今天的记录",
    restartLabel: "开始下一次专注",
  },
  {
    title: "这一段已经留下来了",
    subtitle: "你刚刚认真走过的那段时间，现在已经安静地躺进今天的轨迹里了。",
    viewLabel: "回看今天轨迹",
    restartLabel: "再开始一段",
  },
  {
    title: "这一次没有白白过去",
    subtitle: "它已经被好好记住。等你回看今天时，这一段会清清楚楚地出现在那里。",
    viewLabel: "去看完整记录",
    restartLabel: "继续下一段专注",
  },
];

export function getDailyCopyIndex(length: number, offset = 0) {
  const today = new Date();
  const seed =
    today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate() + offset;
  return seed % length;
}
