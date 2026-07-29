import React from "react";
import ReactDOM from "react-dom/client";
import { motion } from "framer-motion";
import "./styles.css";

const cabins = [
  { id: "home", no: "01", en: "HOME", zh: "个人主页", detail: "首页舱", glyph: "◎" },
  { id: "about", no: "02", en: "ABOUT", zh: "个人经历", detail: "档案舱", glyph: "⌁" },
  { id: "portfolio", no: "03", en: "PORTFOLIO", zh: "AI 作品", detail: "作品舱", glyph: "◇" },
  { id: "workflow", no: "04", en: "WORKFLOW", zh: "制作流程", detail: "实验舱", glyph: "⌬" },
  { id: "contact", no: "05", en: "CONTACT", zh: "联系方式", detail: "通讯舱", glyph: "⌁" },
];

const cabinLabels = {
  home: { nav: "首页", title: "首页", zh: "首页舱", detail: "个人数字片场入口" },
  about: { nav: "关于", title: "关于我", zh: "档案舱", detail: "创作系统" },
  portfolio: { nav: "作品", title: "作品集", zh: "作品舱", detail: "AI 影像档案" },
  workflow: { nav: "流程", title: "制作流程", zh: "实验舱", detail: "AI 制作流程" },
  contact: { nav: "联系", title: "联系我", zh: "通讯舱", detail: "未来通讯终端" },
};

const getCabinLabel = (cabin) => cabinLabels[cabin.id] || {
  nav: cabin.en,
  title: cabin.en,
  zh: cabin.zh,
  detail: cabin.detail,
};

function Starfield() {
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let frame;
    let stars = [];
    let width = 0;
    let height = 0;
    let pointerX = 0;
    let pointerY = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.6);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = width < 700 ? 80 : 170;
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 1.2 + 0.2,
        r: Math.random() * 1.3 + 0.25,
        a: Math.random() * 0.7 + 0.2,
        hue: Math.random() > 0.76 ? 205 : 220,
      }));
    };

    const onPointerMove = (event) => {
      pointerX = event.clientX / width - 0.5;
      pointerY = event.clientY / height - 0.5;
    };

    const draw = (time) => {
      ctx.clearRect(0, 0, width, height);
      for (const star of stars) {
        star.x -= 0.055 * star.z;
        if (star.x < -4) star.x = width + 4;
        const pulse = Math.sin(time * 0.0014 * star.z + star.x) * 0.18;
        const x = star.x + pointerX * 10 * star.z;
        const y = star.y + pointerY * 6 * star.z;
        ctx.beginPath();
        ctx.fillStyle = `hsla(${star.hue}, 100%, 88%, ${star.a + pulse})`;
        ctx.arc(x, y, star.r * star.z, 0, Math.PI * 2);
        ctx.fill();
      }
      frame = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="starfield" aria-hidden="true" />;
}

function Locomotive() {
  return (
    <motion.div
      className="locomotive"
      aria-label="未来太空列车驾驶舱装饰"
    >
      <div className="engine-ridge" />
      <div className="engine-shell">
        <div className="engine-ring ring-one" />
        <div className="engine-ring ring-two" />
        <div className="engine-core"><i /></div>
      </div>
      <div className="cockpit">
        <span>列车驾驶舱</span>
        <b>驾驶舱</b>
      </div>
      <div className="engine-skirt"><span>AIGC // PILOT CORE</span></div>
      <div className="wheel wheel-a" />
      <div className="wheel wheel-b" />
    </motion.div>
  );
}

function Carriage({ cabin, index, onSelect }) {
  const label = getCabinLabel(cabin);
  return (
    <motion.button
      className={`carriage carriage-${index} theme-${cabin.id}`}
      type="button"
      onClick={() => onSelect(cabin)}
      whileHover={{ y: -9, scale: 1.018 }}
      whileTap={{ scale: 0.985 }}
      aria-label={`进入${cabin.zh}页面`}
    >
      <span className="carriage-top"><i /><i /><i /></span>
      <span className="carriage-panel">
        <span className="carriage-index">{cabin.no}</span>
        <span className="cabin-glyph">{cabin.glyph}</span>
        <span className="carriage-en">{label.title}</span>
        <span className="carriage-zh">{label.zh}</span>
        <span className="carriage-detail">{label.detail}</span>
        <span className="enter-mark">ENTER ↗</span>
      </span>
      <span className="carriage-base" />
      <span className="carriage-wheel left" />
      <span className="carriage-wheel right" />
    </motion.button>
  );
}

function Train({ onSelect }) {
  return (
    <motion.div
      className="train"
      initial={{ x: "36vw", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 1.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
    >
      <Locomotive />
      <div className="connector" />
      {cabins.map((cabin, index) => (
        <React.Fragment key={cabin.id}>
          <Carriage cabin={cabin} index={index} onSelect={onSelect} />
          {index < cabins.length - 1 && <div className="connector small" />}
        </React.Fragment>
      ))}
    </motion.div>
  );
}

const creativeSkills = [
  { no: "01", title: "故事构思", en: "STORY CONCEPT" },
  { no: "02", title: "角色设计", en: "CHARACTER DESIGN" },
  { no: "03", title: "场景生成", en: "SCENE GENERATION" },
  { no: "04", title: "AI 视频制作", en: "AI VIDEO" },
  { no: "05", title: "后期包装", en: "POST PRODUCTION" },
];

const timeline = [
  { year: "2025", title: "Started exploring", detail: "AI creative workflow" },
  { year: "2025.10", title: "AIGC Content Creation", detail: "Internship" },
  { year: "2026", title: "AI Visual Creator", detail: "Creating stories with AI" },
];

const directorSystems = [
  { year: "2025.10—2026.06", title: "AI 漫剧制作师", detail: "北京星梦启袁文化传媒有限公司" },
  { year: "20+ 集", title: "AI 漫剧项目", detail: "剧本拆解 / 角色设定 / 动态成片" },
  { year: "20+ 条", title: "AI 商业广告", detail: "视觉方案 / AI 生成 / 后期包装" },
];

function AboutCabin({ onClose, onNavigate }) {
  return (
    <motion.section
      className="cabin-page about-cabin"
      initial={{ opacity: 0, clipPath: "inset(50% 0 50% 0)" }}
      animate={{ opacity: 1, clipPath: "inset(0% 0 0% 0)" }}
      exit={{ opacity: 0, clipPath: "inset(50% 0 50% 0)" }}
      transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
      aria-labelledby="about-title"
    >
      <div className="cabin-scan" />
      <header className="cabin-header">
        <button className="back-to-train" onClick={onClose}>
          <span>←</span> 返回列车
        </button>
        <div className="cabin-coordinate">02 车厢 / 档案舱</div>
        <div className="cabin-live"><i /> 系统在线</div>
      </header>

      <div className="about-layout">
        <div className="about-intro">
          <div className="section-code"><span>章节 01</span><i /></div>
          <div className="section-kicker">创作档案</div>
          <h2 id="about-title">AIGC 内容<br /><em>创作师</em></h2>
          <div className="director-copy">
            <p>我把生成式 AI 当作一套完整影像生产系统，从故事、角色与场景设定，一直推进到动态镜头和最终成片。</p>
          </div>
          <p>我是一个专注 AIGC 内容创作方向的数字内容创作者。</p>
          <p>我使用生成式 AI，将想法发展为角色、场景与可以播放的视觉故事。</p>
          <div className="profile-dossier">
            <div className="profile-portrait">
              <img src="/profile/yang-xiaogang-portrait.png" alt="杨孝刚个人照片" />
              <span>CREATOR PROFILE</span>
            </div>
            <div className="profile-identity">
              <small>身份档案 / 001</small>
              <strong>杨孝刚</strong>
              <p>AI 漫剧制作师<br />AIGC 内容创作师</p>
              <div><span>所在地</span><b>北京</b></div>
              <div className="profile-education">
                <span>教育背景</span>
                <b>郑州工商学院</b>
                <small>数据科学与大数据技术<br />本科 / 2022.09—2026.06</small>
              </div>
            </div>
          </div>
        </div>

        <div className="about-right-column">
          <div className="about-timeline profile-career-timeline">
            <div className="panel-heading">
              <span>职业档案</span>
              <small>经历 / 项目成果</small>
            </div>
            <div className="timeline-line">
              {directorSystems.map((item, index) => (
                <motion.div
                  className="timeline-event"
                  key={item.year}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 + index * 0.12 }}
                >
                  <i />
                  <time>{item.year}</time>
                  <b>{item.title}</b>
                  <span>{item.detail}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.section
            className="creator-profile-brief"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.62, duration: 0.55 }}
            aria-label="个人简介与专业能力"
          >
            <div className="brief-heading">
              <span>创作者档案 / 002</span>
              <b>个人简介与专业能力</b>
              <small>CREATOR DOSSIER</small>
            </div>

            <div className="brief-grid">
              <article className="brief-panel brief-about">
                <span className="brief-index">01 / ABOUT ME</span>
                <h3>用 AI 构建<br />可持续的视觉叙事</h3>
                <p>
                  专注 AIGC 内容创作与 AI 视觉设计，具备 AI 漫剧、AI 视频及商业视觉制作经验。
                  能够将创意从剧本拆解推进至角色与场景资产、镜头动态化和最终成片。
                </p>
                <p>
                  关注叙事节奏、角色一致性与画面完成度，让生成式 AI 真正服务于内容表达。
                </p>
              </article>

              <article className="brief-panel brief-experience">
                <span className="brief-index">02 / EXPERIENCE</span>
                <div className="experience-title">
                  <div>
                    <h3>AI 漫剧制作师</h3>
                    <p>北京星梦启袁文化传媒有限公司 · 实习</p>
                  </div>
                  <time>2025.10—2026.06</time>
                </div>
                <ul>
                  <li><i>01</i><span>剧本分析、剧情拆解与分镜规划</span></li>
                  <li><i>02</i><span>角色、场景、道具视觉资产生成</span></li>
                  <li><i>03</i><span>角色一致性控制与镜头画面优化</span></li>
                  <li><i>04</i><span>AI 视频动态化、剪辑与成片包装</span></li>
                </ul>
              </article>
            </div>
            <button className="next-cabin brief-next-cabin" onClick={() => onNavigate(cabins[2])}>
              下一站 <b>03 / 作品集</b><span>→</span>
            </button>
          </motion.section>
        </div>

      </div>
    </motion.section>
  );
}

const projectTemplates = [
  {
    id: "case-01",
    type: "AI Animation",
    cover: { type: "image", src: "", alt: "作品封面" },
    gallery: [
      { type: "image", src: "", label: "IMAGE" },
      { type: "video", src: "", poster: "", label: "VIDEO" },
      { type: "gif", src: "", label: "GIF" },
    ],
  },
  {
    id: "case-02",
    type: "AI Short Film",
    cover: { type: "image", src: "", alt: "作品封面" },
    gallery: [
      { type: "image", src: "", label: "IMAGE" },
      { type: "video", src: "", poster: "", label: "VIDEO" },
      { type: "gif", src: "", label: "GIF" },
    ],
  },
  {
    id: "case-03",
    type: "AI Visual Project",
    cover: { type: "image", src: "", alt: "作品封面" },
    gallery: [
      { type: "image", src: "", label: "IMAGE" },
      { type: "video", src: "", poster: "", label: "VIDEO" },
      { type: "gif", src: "", label: "GIF" },
    ],
  },
];

const productionSteps = ["角色设计", "场景设计", "分镜设计", "AI 生成", "后期制作"];
const projectTools = ["Stable Diffusion", "ComfyUI", "Midjourney", "AI Video Tools"];

function ProjectMedia({ media, featured = false }) {
  if (media?.src && media.type === "video") {
    return <video className="project-media-file" src={media.src} poster={media.poster} controls playsInline />;
  }
  if (media?.src) {
    return <img className="project-media-file" src={media.src} alt={media.alt || media.label || "项目媒体"} />;
  }
  return (
    <div className={`media-placeholder ${featured ? "featured" : ""}`}>
      <div className="media-grid" />
      <span className="media-corners" />
      <div className="media-orbit"><i /><i /></div>
      <small>{featured ? "作品封面" : media?.label || "素材位"}</small>
      <b>{featured ? "16 : 9 / 视觉画幅" : "媒体占位"}</b>
      <em>{media?.type?.toUpperCase() || "IMAGE"} 就绪</em>
    </div>
  );
}

const cinemaProjectTemplates = [
  {
    id: "case-01",
    title: "《精方》护发素TVC广告",
    type: "AITVC Advertisement",
    tone: "AI 商业影像",
    objective: "以生成式 AI 完成护发产品的广告视觉表达，呈现产品质感、品牌氛围与短片叙事节奏。",
    duration: 17,
    externalUrl: "https://www.bilibili.com/video/BV1yuK86gEjB?vd_source=9e1a616b4678202c7a7a3998ae65ce48",
    cover: { type: "image", src: "/video-covers/jingfang.jpg", alt: "《精方》护发素TVC广告封面" },
    gallery: [
      { type: "image", src: "", label: "关键视觉" },
      { type: "video", src: "", poster: "", label: "动态测试" },
      { type: "gif", src: "", label: "循环镜头" },
    ],
  },
  {
    id: "case-02",
    title: "AI短片《年兽来啦》",
    type: "AI Short Film",
    tone: "东方幻想影像",
    objective: "以中国传统年兽意象为灵感，通过生成式 AI 构建角色、场景与动态镜头，完成东方幻想风格短片。",
    duration: 173,
    externalUrl: "https://www.bilibili.com/video/BV16VKt6fEaG?vd_source=9e1a616b4678202c7a7a3998ae65ce48",
    cover: { type: "image", src: "/video-covers/nianshou.jpg", alt: "AI短片《年兽来啦》视频封面" },
    gallery: [
      { type: "image", src: "", label: "氛围帧" },
      { type: "video", src: "", poster: "", label: "场景片段" },
      { type: "gif", src: "", label: "动态节奏" },
    ],
  },
  {
    id: "case-05",
    title: "《BDE登山杖》TVC广告",
    type: "AITVC Advertisement",
    tone: "户外产品影像",
    objective: "以登山与户外探索场景强化产品性能表达，通过生成式 AI 构建兼具力量感、速度感与商业质感的 TVC 影像。",
    duration: 11,
    externalUrl: "https://www.bilibili.com/video/BV1mRKm6aEoz?vd_source=9e1a616b4678202c7a7a3998ae65ce48",
    cover: { type: "image", src: "/video-covers/bde.jpg", alt: "《BDE登山杖》TVC广告封面" },
    gallery: [
      { type: "image", src: "", label: "产品视觉" },
      { type: "video", src: "", poster: "", label: "户外镜头" },
      { type: "gif", src: "", label: "动作循环" },
    ],
  },
  {
    id: "case-07",
    title: "AI漫剧《寻迹》预告片",
    type: "AI Short Film",
    tone: "末日废土叙事",
    objective: "以末日废土世界为背景，利用生成式 AI 构建生存角色、荒芜场景与危机镜头，呈现紧张且具有电影感的求生叙事。",
    duration: 126,
    externalUrl: "https://www.bilibili.com/video/BV1a4KU6rEhm?vd_source=9e1a616b4678202c7a7a3998ae65ce48",
    cover: { type: "image", src: "/video-covers/xunji.jpg", alt: "AI漫剧《寻迹》预告片视频封面" },
    gallery: [
      { type: "image", src: "", label: "废土视觉" },
      { type: "video", src: "", poster: "", label: "求生镜头" },
      { type: "gif", src: "", label: "危机循环" },
    ],
  },
  {
    id: "case-08",
    title: "AI漫剧《极速狂飙：燃魂赛道》片段",
    type: "AI Action Video",
    tone: "极速竞技影像",
    objective: "围绕赛车竞技的速度、对抗与赛道氛围，通过生成式 AI 构建高速运镜、机械细节和充满冲击力的动作影像。",
    duration: 212,
    externalUrl: "https://www.bilibili.com/video/BV13bKU6gEpL?vd_source=9e1a616b4678202c7a7a3998ae65ce48",
    cover: { type: "image", src: "/video-covers/racing.jpg", alt: "AI漫剧《极速狂飙：燃魂赛道》片段视频封面" },
    gallery: [
      { type: "image", src: "", label: "赛车视觉" },
      { type: "video", src: "", poster: "", label: "竞速镜头" },
      { type: "gif", src: "", label: "速度循环" },
    ],
  },
  {
    id: "case-09",
    title: "互动AI视频",
    type: "Interactive AI Video",
    tone: "互动叙事影像",
    objective: "探索互动机制与 AI 影像叙事的结合，通过分支内容、视觉反馈与动态镜头，增强观众参与感和沉浸体验。",
    duration: 11,
    externalUrl: "https://www.bilibili.com/video/BV1UvKU6NEc3?vd_source=9e1a616b4678202c7a7a3998ae65ce48",
    cover: { type: "image", src: "/video-covers/interactive.jpg", alt: "互动AI视频封面" },
    gallery: [
      { type: "image", src: "", label: "互动视觉" },
      { type: "video", src: "", poster: "", label: "交互片段" },
      { type: "gif", src: "", label: "反馈循环" },
    ],
  },
  {
    id: "case-10",
    title: "微信小游戏《水果切切乐》AI推广视频",
    type: "Interactive AI Video",
    tone: "游戏化互动影像",
    objective: "将切水果挑战的即时反馈与 AI 影像结合，通过节奏化动作、视觉特效和互动机制，打造轻量且具有参与感的游戏化内容。",
    duration: 14,
    externalUrl: "https://www.bilibili.com/video/BV1LnKU61EAH?vd_source=9e1a616b4678202c7a7a3998ae65ce48",
    cover: { type: "image", src: "/video-covers/fruit.jpg", alt: "微信小游戏《水果切切乐》AI推广视频封面" },
    gallery: [
      { type: "image", src: "", label: "挑战视觉" },
      { type: "video", src: "", poster: "", label: "互动片段" },
      { type: "gif", src: "", label: "特效循环" },
    ],
  },
  {
    id: "case-11",
    title: "女装带货AI视频",
    type: "AI Fashion Video",
    tone: "虚拟时尚影像",
    objective: "探索生成式 AI 在造型切换与虚拟时尚表达中的应用，通过连续换装、人物一致性和节奏化转场呈现多样视觉风格。",
    duration: 11,
    externalUrl: "https://www.bilibili.com/video/BV1RpKU6VEzt?vd_source=9e1a616b4678202c7a7a3998ae65ce48",
    cover: { type: "image", src: "/video-covers/fashion.jpg", alt: "女装带货AI视频封面" },
    gallery: [
      { type: "image", src: "", label: "造型视觉" },
      { type: "video", src: "", poster: "", label: "换装片段" },
      { type: "gif", src: "", label: "转场循环" },
    ],
  },
  {
    id: "case-12",
    title: "AI漫剧《逆天修仙录》片段",
    type: "AI Action Video",
    tone: "东方仙侠动作影像",
    objective: "以东方仙侠世界为背景，通过生成式 AI 构建人物招式、能量特效与高速战斗镜头，呈现具有电影感的动作场面。",
    duration: 102,
    externalUrl: "https://www.bilibili.com/video/BV1B3gz6eE5Y?vd_source=9e1a616b4678202c7a7a3998ae65ce48",
    cover: { type: "image", src: "/video-covers/xiuxian.jpg", alt: "AI漫剧《逆天修仙录》片段视频封面" },
    gallery: [
      { type: "image", src: "", label: "仙侠视觉" },
      { type: "video", src: "", poster: "", label: "战斗镜头" },
      { type: "gif", src: "", label: "招式循环" },
    ],
  },
  {
    id: "case-13",
    title: "AI漫剧《赤霄：2077》片段",
    type: "AI Comic Series",
    tone: "东方赛博叙事",
    objective: "以近未来东方都市为视觉背景，围绕角色冲突与世界观线索展开叙事，通过生成式 AI 构建赛博空间、连续角色和电影化动态镜头。",
    duration: 170,
    externalUrl: "https://www.bilibili.com/video/BV1PegZ6aEC8?vd_source=9e1a616b4678202c7a7a3998ae65ce48",
    cover: { type: "image", src: "/video-covers/chixiao.jpg", alt: "AI漫剧《赤霄：2077》片段视频封面" },
    gallery: [
      { type: "image", src: "", label: "世界观视觉" },
      { type: "video", src: "", poster: "", label: "剧情片段" },
      { type: "gif", src: "", label: "动态镜头" },
    ],
  },
  {
    id: "case-14",
    title: "AI出海漫剧《黑夜王冠》片段",
    type: "AI Comic Series",
    tone: "暗黑幻想叙事",
    objective: "面向出海漫剧内容，以暗黑幻想世界观组织角色关系、戏剧冲突与场景氛围，呈现兼具连续叙事和国际化视觉风格的 AI 影像片段。",
    duration: 132,
    externalUrl: "https://www.bilibili.com/video/BV1CegZ6hEWV?vd_source=9e1a616b4678202c7a7a3998ae65ce48",
    cover: { type: "image", src: "/video-covers/crown.jpg", alt: "AI出海漫剧《黑夜王冠》片段视频封面" },
    gallery: [
      { type: "image", src: "", label: "角色视觉" },
      { type: "video", src: "", poster: "", label: "剧情片段" },
      { type: "gif", src: "", label: "氛围镜头" },
    ],
  },
];

const imageWorkGroups = [
  {
    id: "ai-story",
    no: "01",
    title: "AI 漫剧设定",
    en: "AI STORY DEVELOPMENT",
    description: "人物、场景与世界观设定，展示从概念到视觉系统的构建能力。",
    layout: "wide",
    images: [
      { src: "/works/ai-story/01.png", alt: "AI 漫剧人物与场景设定 01" },
      { src: "/works/ai-story/02.png", alt: "AI 漫剧人物与场景设定 02" },
    ],
  },
  {
    id: "ip-vi",
    no: "02",
    title: "IP 形象与 VI 延展",
    en: "IP & VISUAL IDENTITY",
    description: "从角色造型到品牌触点，建立可持续延展的视觉资产。",
    layout: "wide",
    images: Array.from({ length: 4 }, (_, index) => ({
      src: `/works/ip-vi/${String(index + 1).padStart(2, "0")}.png`,
      alt: `IP 形象与 VI 延展 ${String(index + 1).padStart(2, "0")}`,
    })),
  },
  {
    id: "banner",
    no: "03",
    title: "Banner 视觉",
    en: "CAMPAIGN BANNERS",
    description: "围绕不同品牌主题完成横版视觉组织、信息层级与系列化表达。",
    layout: "wide",
    images: Array.from({ length: 8 }, (_, index) => ({
      src: `/works/banner/${String(index + 1).padStart(2, "0")}.png`,
      alt: `Banner 视觉设计 ${String(index + 1).padStart(2, "0")}`,
    })),
  },
  {
    id: "posters",
    no: "04",
    title: "海报设计",
    en: "POSTER DESIGN",
    description: "以构图、字体和色彩建立鲜明视觉焦点，覆盖多种内容方向。",
    layout: "portrait",
    images: Array.from({ length: 8 }, (_, index) => ({
      src: `/works/posters/${String(index + 1).padStart(2, "0")}.png`,
      alt: `海报设计 ${String(index + 1).padStart(2, "0")}`,
    })),
  },
  {
    id: "typography",
    no: "05",
    title: "字体设计",
    en: "TYPOGRAPHY",
    description: "探索字体结构、速度感与情绪表达，让文字成为画面的主视觉。",
    layout: "wide",
    images: Array.from({ length: 4 }, (_, index) => ({
      src: `/works/typography/${String(index + 3).padStart(2, "0")}.png`,
      alt: `字体设计 ${String(index + 1).padStart(2, "0")}`,
    })),
  },
  {
    id: "symbols",
    no: "06",
    title: "超级符号",
    en: "SUPER SYMBOL",
    description: "把品牌概念转化为具有识别度、记忆点和延展性的核心符号。",
    layout: "portrait compact",
    images: Array.from({ length: 3 }, (_, index) => ({
      src: `/works/symbols/${String(index + 1).padStart(2, "0")}.png`,
      alt: `超级符号设计 ${String(index + 1).padStart(2, "0")}`,
    })),
  },
  {
    id: "icons",
    no: "07",
    title: "图标系统",
    en: "ICON SYSTEM",
    description: "统一视觉语言下的图标探索，兼顾识别效率与风格表达。",
    layout: "mixed",
    images: Array.from({ length: 2 }, (_, index) => ({
      src: `/works/icons/${String(index + 3).padStart(2, "0")}.png`,
      alt: `图标系统设计 ${String(index + 1).padStart(2, "0")}`,
    })),
  },
];

const imageWorkTotal = imageWorkGroups.reduce((total, group) => total + group.images.length, 0);
const allImageWorks = imageWorkGroups.flatMap((group) =>
  group.images.map((image, index) => ({
    ...image,
    group: group.title,
    index: index + 1,
  }))
);

function PortfolioCabin({ onClose, onNavigate }) {
  const [playingProjects, setPlayingProjects] = React.useState(() => new Set());
  const [selectedArtwork, setSelectedArtwork] = React.useState(null);
  const navigateArtwork = (direction) => {
    setSelectedArtwork((current) => {
      if (!current) return current;
      const nextIndex = (current.globalIndex + direction + allImageWorks.length) % allImageWorks.length;
      return { ...allImageWorks[nextIndex], globalIndex: nextIndex };
    });
  };
  React.useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") setSelectedArtwork(null);
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setSelectedArtwork((current) => {
          if (!current) return current;
          const nextIndex = (current.globalIndex - 1 + allImageWorks.length) % allImageWorks.length;
          return { ...allImageWorks[nextIndex], globalIndex: nextIndex };
        });
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        setSelectedArtwork((current) => {
          if (!current) return current;
          const nextIndex = (current.globalIndex + 1) % allImageWorks.length;
          return { ...allImageWorks[nextIndex], globalIndex: nextIndex };
        });
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
  const getBilibiliEmbedUrl = (url) => {
    const bvid = url?.match(/video\/(BV[\w]+)/)?.[1];
    return bvid
      ? `https://player.bilibili.com/player.html?isOutside=true&bvid=${bvid}&p=1&high_quality=1&danmaku=0&autoplay=0`
      : "";
  };
  const playProject = (projectId) => {
    setPlayingProjects((current) => {
      const next = new Set(current);
      next.add(projectId);
      return next;
    });
  };
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remaining = String(seconds % 60).padStart(2, "0");
    return `${minutes}:${remaining}`;
  };
  const projectsByDuration = [...cinemaProjectTemplates].sort((a, b) => b.duration - a.duration);
  const longProjects = projectsByDuration.filter((project) => project.duration >= 60);
  const shortProjects = projectsByDuration.filter((project) => project.duration < 60);
  const renderProjectCards = (projects, prefix) => projects.map((project, index) => {
    const embedUrl = getBilibiliEmbedUrl(project.externalUrl);
    return (
      <motion.article
        className="video-project-card"
        key={project.id}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: .55, delay: (index % 3) * .06 }}
      >
        <div className="video-player-shell">
          {embedUrl && playingProjects.has(project.id) ? (
            <iframe
              src={embedUrl}
              title={`${project.title} 视频播放器`}
              loading="lazy"
              scrolling="no"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <button
              className="video-cover-button"
              type="button"
              aria-label={`播放 ${project.title}`}
              onClick={() => playProject(project.id)}
            >
              <img src={project.cover.src} alt={project.cover.alt} loading="lazy" referrerPolicy="no-referrer" />
              <i className="video-play-icon"><span>▶</span></i>
            </button>
          )}
          <span className="video-card-number">{prefix}{String(index + 1).padStart(2, "0")}</span>
          <small className="video-duration">{formatDuration(project.duration)}</small>
        </div>
        <div className="video-project-copy">
          <small>{project.tone} / {project.type}</small>
          <h3>{project.title}</h3>
          <p>{project.objective}</p>
          {project.externalUrl && (
            <a href={project.externalUrl} target="_blank" rel="noreferrer">
              查看完整作品 <i>↗</i>
            </a>
          )}
        </div>
      </motion.article>
    );
  });

  return (
    <motion.section
      className="cabin-page portfolio-cabin"
      initial={{ opacity: 0, clipPath: "inset(0 50% 0 50%)" }}
      animate={{ opacity: 1, clipPath: "inset(0 0% 0 0%)" }}
      exit={{ opacity: 0, clipPath: "inset(0 50% 0 50%)" }}
      transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
      aria-labelledby="portfolio-title"
    >
      <div className="cabin-scan" />
      <header className="cabin-header">
        <button className="back-to-train" onClick={onClose}><span>←</span> 返回列车</button>
        <div className="cabin-coordinate">03 车厢 / 影像档案舱</div>
        <div className="cabin-live"><i /> 媒体系统在线</div>
      </header>

      <div className="portfolio-layout portfolio-gallery-layout">
        <div className="portfolio-gallery-heading">
          <div>
          <div className="section-code"><span>章节 02</span><i /></div>
          <div className="section-kicker">影像档案</div>
            <h2 id="portfolio-title">AI 影像作品</h2>
          </div>
          <p>全部作品直接展开浏览。每个项目都可以在当前页面播放，并保留完整作品入口。</p>
        </div>

        <section className="portfolio-video-group" aria-labelledby="long-video-title">
          <div className="video-group-heading">
            <div><span>01</span><h3 id="long-video-title">漫剧 / 短片</h3><small>AI COMIC / SHORT FILM</small></div>
            <b>{String(longProjects.length).padStart(2, "0")} 个项目</b>
          </div>
          <div className="video-project-grid">
            {renderProjectCards(longProjects, "L")}
          </div>
        </section>

        <section className="portfolio-video-group" aria-labelledby="short-video-title">
          <div className="video-group-heading">
            <div><span>02</span><h3 id="short-video-title">TVC / 小视频</h3><small>TVC / SHORT VIDEO</small></div>
            <b>{String(shortProjects.length).padStart(2, "0")} 个项目</b>
          </div>
          <div className="video-project-grid">
            {renderProjectCards(shortProjects, "S")}
          </div>
        </section>

        <section className="image-portfolio-archive" aria-labelledby="image-archive-title">
          <div className="image-archive-heading">
            <div>
              <span>03</span>
              <h3 id="image-archive-title">视觉设计作品</h3>
              <small>VISUAL DESIGN ARCHIVE</small>
            </div>
            <p>共 {imageWorkTotal} 张作品 · 点击画面查看完整大图</p>
          </div>

          {imageWorkGroups.map((group) => (
            <section className={`artwork-group artwork-group-${group.id}`} key={group.id} aria-labelledby={`${group.id}-title`}>
              <header className="artwork-group-heading">
                <div>
                  <span>{group.no}</span>
                  <div>
                    <h4 id={`${group.id}-title`}>{group.title}</h4>
                    <small>{group.en}</small>
                  </div>
                </div>
                <p>{group.description}</p>
                <b>{String(group.images.length).padStart(2, "0")}</b>
              </header>
              <div className={`artwork-grid artwork-grid-${group.layout.replace(" ", " artwork-grid-")}`}>
                {group.images.map((image, index) => (
                  <motion.button
                    className="artwork-card"
                    type="button"
                    key={image.src}
                    onClick={() => {
                      const globalIndex = allImageWorks.findIndex((item) => item.src === image.src);
                      setSelectedArtwork({ ...allImageWorks[globalIndex], globalIndex });
                    }}
                    initial={{ opacity: 0, y: 22 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-70px" }}
                    transition={{ duration: .48, delay: (index % 4) * .045 }}
                    aria-label={`放大查看${image.alt}`}
                  >
                    <img src={image.src} alt={image.alt} loading="lazy" />
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <i>查看大图 ↗</i>
                  </motion.button>
                ))}
              </div>
            </section>
          ))}
        </section>

        <div className="portfolio-gallery-footer">
          <span>{cinemaProjectTemplates.length} 个影像项目 · {imageWorkTotal} 张视觉作品</span>
          <button className="next-cabin portfolio-gallery-next" onClick={() => onNavigate(cabins[3])}>
            下一站 <b>04 / 制作流程</b><span>→</span>
          </button>
        </div>
      </div>

      {selectedArtwork && (
        <motion.div
          className="artwork-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${selectedArtwork.group}大图预览`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedArtwork(null)}
        >
          <button className="lightbox-close" type="button" onClick={() => setSelectedArtwork(null)} aria-label="关闭大图">
            关闭 ×
          </button>
          <div className="lightbox-frame" onClick={(event) => event.stopPropagation()}>
            <button
              className="lightbox-nav lightbox-prev"
              type="button"
              onClick={() => navigateArtwork(-1)}
              aria-label="查看上一张图片"
            >
              ←
            </button>
            <img
              key={selectedArtwork.src}
              src={selectedArtwork.src}
              alt={selectedArtwork.alt}
              onClick={() => navigateArtwork(1)}
              title="点击查看下一张"
            />
            <button
              className="lightbox-nav lightbox-next"
              type="button"
              onClick={() => navigateArtwork(1)}
              aria-label="查看下一张图片"
            >
              →
            </button>
            <div>
              <span>{selectedArtwork.group}</span>
              <small>
                {String(selectedArtwork.globalIndex + 1).padStart(2, "0")} / {String(allImageWorks.length).padStart(2, "0")}
              </small>
            </div>
          </div>
        </motion.div>
      )}
    </motion.section>
  );
}

const nianShouWorkflowSteps = [
  {
    no: "01", title: "Story Setting", zh: "剧情设定", icon: "◇",
    description: "先明确《年兽来啦》的故事主线与人物关系，以六步剧情推进年兽从神秘现身、获得接纳到融入春节庆典的情感转变，为后续角色、场景和道具设计建立统一的叙事依据。",
    input: "故事梗概 / 角色关系", output: "剧情结构 / 情绪节拍",
    image: "/workflow/nian-shou/story-setting.png",
    imageAlt: "《年兽来啦》故事背景、六步剧情进程、角色关系与世界观设定",
    imageScale: 1,
    imageOrigin: "center center",
    imageFit: "contain",
    visualTitle: "六步式剧情设定",
    visualNote: "发现年兽 → 温暖相待 → 消除误解 → 团圆庆典",
    focus: ["故事主线", "人物关系", "情绪转折"],
  },
  {
    no: "02", title: "Character Design", zh: "角色设定", icon: "◈",
    description: "建立年兽宝宝、奶奶与三位村童的统一造型规范。通过三视图、表情、动作和服装细节锁定角色特征，在保留春节民俗识别度的同时强化温暖、童趣与群像差异。",
    input: "角色关键词 / 民俗参考", output: "三视图 / 表情与服装规范",
    images: [
      { src: "/workflow/nian-shou/characters/nian-shou.png", alt: "年兽宝宝角色设定" },
      { src: "/workflow/nian-shou/characters/grandma.png", alt: "奶奶角色设定" },
      { src: "/workflow/nian-shou/characters/playful-boy.png", alt: "淘气小子角色设定" },
      { src: "/workflow/nian-shou/characters/chubby-boy.png", alt: "憨厚小胖角色设定" },
      { src: "/workflow/nian-shou/characters/clever-girl.png", alt: "机灵女孩角色设定" },
    ],
    imageFit: "contain",
    visualTitle: "角色系统与一致性规范",
    visualNote: "年兽宝宝 × 奶奶 × 淘气小子 × 憨厚小胖 × 机灵女孩",
    focus: ["角色三视图", "表情系统", "服装统一"],
  },
  {
    no: "03", title: "Scene Design", zh: "场景设定", icon: "⬡",
    description: "围绕年兽树洞、雪夜院门、春节广场、村庄街巷与奶奶厨房建立五组核心空间。用蓝色雪夜与橙红灯火形成冷暖对比，让不同场景保持统一的地域、年代与年俗气质。",
    input: "剧情场次 / 空间参考", output: "场景库 / 光影与色彩规范",
    images: [
      { src: "/workflow/nian-shou/scenes/nian-shou-cave.png", alt: "年兽树洞小窝场景设定" },
      { src: "/workflow/nian-shou/scenes/snowy-doorstep.png", alt: "雪夜院门送福场景设定" },
      { src: "/workflow/nian-shou/scenes/festival-square.png", alt: "春节广场团圆庆典场景设定" },
      { src: "/workflow/nian-shou/scenes/snowy-village.png", alt: "雪夜村庄街巷场景设定" },
      { src: "/workflow/nian-shou/scenes/grandma-kitchen.png", alt: "奶奶家厨房场景设定" },
    ],
    imageFit: "contain",
    visualTitle: "五组核心故事空间",
    visualNote: "树洞小窝 × 雪夜院门 × 春节广场 × 村庄街巷 × 奶奶厨房",
    focus: ["空间连续", "冷暖光影", "年俗环境"],
  },
  {
    no: "04", title: "Prop Design", zh: "道具设定", icon: "✣",
    description: "提取推动剧情与强化年味的关键道具：灯笼、福字、鞭炮、饺子、围裙、草帽、油灯和包饺子工具。统一材质、年代感与使用方式，让道具真正参与叙事。",
    input: "剧情动作 / 年俗资料", output: "道具清单 / 资产规范",
    image: "/workflow/nian-shou/prop-design.png",
    imageAlt: "《年兽来啦》灯笼、饺子、福字、鞭炮、服装与乡村器具道具设定",
    imageScale: 1,
    imageOrigin: "center center",
    imageFit: "contain",
    visualTitle: "年俗道具与生活细节",
    visualNote: "灯笼 × 福字 × 鞭炮 × 饺子 × 生活器物",
    focus: ["剧情道具", "材质统一", "年代细节"],
  },
];

const chiXiaoWorkflowSteps = [
  {
    no: "01", title: "Story Setting", zh: "剧情设定", icon: "◇",
    description: "梳理《赤霄：2077》的世界背景、人物关系、核心冲突与剧情节点，先确定每场戏要传递的信息和情绪，再进入视觉生产，让漫剧画面始终围绕故事推进。",
    input: "故事梗概 / 人物关系", output: "剧情结构 / 情绪节拍",
    image: "/workflow/chi-xiao/story-setting.png",
    imageAlt: "AI漫剧《赤霄：2077》剧情设定图",
    imageScale: 1,
    imageOrigin: "center center",
    imageFit: "contain",
    visualTitle: "《赤霄：2077》剧情设定",
    visualNote: "六幕结构 × 角色关系 × 世界观 × 视觉基调",
    focus: ["故事主线", "人物关系", "情绪转折"],
  },
  {
    no: "02", title: "Character Design", zh: "角色设定", icon: "◈",
    description: "围绕主要人物建立可持续复用的角色资产，统一面部特征、服装结构、体型比例和情绪表现，为连续镜头中的身份识别与角色一致性提供基础。",
    input: "人物小传 / 造型方向", output: "角色资产 / 一致性规范",
    images: [
      { src: "/workflow/chi-xiao/characters/zhuo-ye.png", alt: "《赤霄：2077》桌爷角色设定" },
      { src: "/workflow/chi-xiao/characters/ying-ren.png", alt: "《赤霄：2077》影刃角色设定" },
      { src: "/workflow/chi-xiao/characters/xiao-li.png", alt: "《赤霄：2077》小狸角色设定" },
      { src: "/workflow/chi-xiao/characters/tie-zuan.png", alt: "《赤霄：2077》铁钻角色设定" },
    ],
    imageFit: "contain",
    imageAlt: "AI漫剧《赤霄：2077》角色设定展示",
    visualTitle: "连续叙事角色设定",
    visualNote: "桌爷 × 影刃 × 小狸 × 铁钻",
    focus: ["角色一致性", "服装结构", "情绪表演"],
  },
  {
    no: "03", title: "Scene Design", zh: "场景设定", icon: "⬡",
    description: "根据故事所需建立统一的世界观视觉语言，控制空间结构、时代质感、主色关系和环境光影，让不同场次在变化中仍属于同一个故事世界。",
    input: "场次需求 / 美术参考", output: "场景资产 / 光影规范",
    images: [
      { src: "/workflow/chi-xiao/scenes/coastal-highway.png", alt: "《赤霄：2077》雨夜滨海公路场景设定" },
      { src: "/workflow/chi-xiao/scenes/megacity-center.png", alt: "《赤霄：2077》巨型赛博都市中心场景设定" },
      { src: "/workflow/chi-xiao/scenes/information-room.png", alt: "《赤霄：2077》城市情报工作室场景设定" },
      { src: "/workflow/chi-xiao/scenes/underground-bar.png", alt: "《赤霄：2077》地下酒吧场景设定" },
      { src: "/workflow/chi-xiao/scenes/lower-city-alley.png", alt: "《赤霄：2077》下层城区追逐巷道场景设定" },
    ],
    imageFit: "contain",
    imageAlt: "AI漫剧《赤霄：2077》场景设定展示",
    visualTitle: "世界观与场景设定",
    visualNote: "滨海公路 × 都市中心 × 情报室 × 地下酒吧 × 下层城区",
    focus: ["世界观统一", "空间连续", "色彩光影"],
  },
  {
    no: "04", title: "Prop Design", zh: "道具设定", icon: "✣",
    description: "围绕剧情中的关键行动建立道具资产，统一武器、设备、服装配件与环境装置的结构、材质和科技感，使道具既符合《赤霄：2077》的世界观，也能够参与人物塑造和剧情推进。",
    input: "剧情动作 / 世界观资料", output: "道具清单 / 资产规范",
    image: "/workflow/chi-xiao/prop-design.png",
    imageAlt: "AI漫剧《赤霄：2077》完整道具设定图",
    imageScale: 1,
    imageOrigin: "center center",
    imageFit: "contain",
    visualTitle: "剧情道具与科技资产",
    visualNote: "能量武士刀 × 战术面罩 × 义体装备 × 载具 × 科技终端",
    focus: ["剧情道具", "材质统一", "世界观细节"],
  },
];

const workflowCases = [
  {
    id: "nian-shou",
    type: "AI 短片",
    title: "《年兽来啦》",
    cover: "/video-covers/nianshou.jpg",
    coverAlt: "AI短片《年兽来啦》视频封面",
    intro: "依据完整设定图，按照剧情、角色、场景与道具四层结构展开视觉开发流程。",
    sampleLabel: "《年兽来啦》制作样本",
    steps: nianShouWorkflowSteps,
  },
  {
    id: "chi-xiao",
    type: "AI 漫剧",
    title: "《赤霄：2077》",
    cover: "/video-covers/chixiao.jpg",
    coverAlt: "AI漫剧《赤霄：2077》视频封面",
    intro: "以实际漫剧片段为案例，按照剧情、角色、场景与道具四层结构展示完整的视觉开发流程。",
    sampleLabel: "《赤霄：2077》制作样本",
    steps: chiXiaoWorkflowSteps,
  },
];

function WorkflowCabin({ onClose, onNavigate }) {
  const [activeCase, setActiveCase] = React.useState(0);
  const [activeStep, setActiveStep] = React.useState(0);
  const [activeSlide, setActiveSlide] = React.useState(0);
  const [isImagePreviewOpen, setIsImagePreviewOpen] = React.useState(false);
  const workflowCase = workflowCases[activeCase];
  const step = workflowCase.steps[activeStep];
  const previewImages = step.images || (step.image ? [{ src: step.image, alt: step.imageAlt }] : []);

  React.useEffect(() => {
    setActiveSlide(0);
  }, [activeCase, activeStep]);

  React.useEffect(() => {
    if (isImagePreviewOpen || !step.images || step.images.length < 2) return undefined;
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % step.images.length);
    }, 3000);
    return () => window.clearInterval(timer);
  }, [step, isImagePreviewOpen]);

  React.useEffect(() => {
    if (!isImagePreviewOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") setIsImagePreviewOpen(false);
      if (previewImages.length > 1 && event.key === "ArrowLeft") {
        event.preventDefault();
        setActiveSlide((current) => (current - 1 + previewImages.length) % previewImages.length);
      }
      if (previewImages.length > 1 && event.key === "ArrowRight") {
        event.preventDefault();
        setActiveSlide((current) => (current + 1) % previewImages.length);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isImagePreviewOpen, previewImages.length]);

  const selectCase = (index) => {
    setActiveCase(index);
    setActiveStep(0);
    setIsImagePreviewOpen(false);
  };

  return (
    <motion.section
      className="cabin-page workflow-cabin"
      initial={{ opacity: 0, filter: "blur(14px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, filter: "blur(14px)" }}
      transition={{ duration: .65 }}
      aria-labelledby="workflow-title"
    >
      <div className="lab-grid" />
      <div className="cabin-scan" />
      <header className="cabin-header">
        <button className="back-to-train" onClick={onClose}><span>←</span> 返回列车</button>
        <div className="cabin-coordinate">04 车厢 / AI 制作实验舱</div>
        <div className="cabin-live"><i /> Pipeline 运行中</div>
      </header>

      <div className="workflow-layout">
        <aside className="workflow-intro">
          <div className="section-code"><span>章节 03</span><i /></div>
          <div className="section-kicker">AI 视觉开发 Pipeline</div>
          <h2 id="workflow-title">从设定<br /><em>到视觉叙事</em></h2>
          <div className="workflow-intro-copy">
            <p><b>案例拆解：{workflowCase.title}</b></p>
            <p>{workflowCase.intro}</p>
          </div>
          <div className="workflow-case-switcher" aria-label="选择制作流程案例">
            {workflowCases.map((item, index) => (
              <button
                key={item.id}
                className={activeCase === index ? "active" : ""}
                onClick={() => selectCase(index)}
              >
                <span className="workflow-case-cover">
                  <img src={item.cover} alt={item.coverAlt} />
                  <i>{String(index + 1).padStart(2, "0")}</i>
                </span>
                <span className="workflow-case-meta">
                  <small>{item.type}</small>
                  <b>{item.title}</b>
                  <em>{activeCase === index ? "当前案例" : "查看流程"} <span>→</span></em>
                </span>
              </button>
            ))}
          </div>
          <p>先建立统一的视觉资产和叙事规则，再进入镜头生产，让 AI 生成真正服务于角色一致性与故事表达。</p>
          <div className="pipeline-status">
            <span>Pipeline 状态</span>
            <div><i /><b>04</b><small>阶段已连接</small></div>
            <div><i /><b>01</b><small>创作系统</small></div>
            <div><i /><b>∞</b><small>持续迭代</small></div>
          </div>
        </aside>

        <nav className="workflow-route" aria-label="AI 内容生产流程">
          <div className="route-energy"><i style={{ height: `${(activeStep / 3) * 100}%` }} /></div>
          {workflowCase.steps.map((item, index) => (
            <motion.button
              key={item.no}
              className={activeStep === index ? "active" : ""}
              onClick={() => setActiveStep(index)}
              whileHover={{ x: 5 }}
            >
              <span className="step-node"><i>{item.icon}</i></span>
              <span className="step-number">{item.no}</span>
              <span className="step-name"><b>{item.zh}</b><small>{item.title}</small></span>
              <span className="step-arrow">↗</span>
            </motion.button>
          ))}
        </nav>

        <article className="workflow-detail">
          <div className="panel-heading">
            <span>{workflowCase.title}制作流程 / {step.no}</span>
            <small>真实项目拆解</small>
          </div>
          <motion.div
            className="workflow-visual"
            key={`visual-${activeStep}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="workflow-case-frame">
              {step.images ? (
                <>
                  <button
                    className="workflow-image-preview-trigger"
                    type="button"
                    onClick={() => setIsImagePreviewOpen(true)}
                    aria-label={`放大查看${step.images[activeSlide].alt}`}
                  >
                    <motion.img
                      key={step.images[activeSlide].src}
                      src={step.images[activeSlide].src}
                      alt={step.images[activeSlide].alt}
                      initial={{ opacity: 0, scale: 1.025 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: .55 }}
                      style={{ objectFit: step.imageFit || "cover" }}
                    />
                    <span>点击查看大图</span>
                  </button>
                  <div className="workflow-carousel-controls">
                    <button
                      type="button"
                      onClick={() => setActiveSlide((activeSlide - 1 + step.images.length) % step.images.length)}
                      aria-label="上一张角色设定图"
                    >←</button>
                    <span>{String(activeSlide + 1).padStart(2, "0")} / {String(step.images.length).padStart(2, "0")}</span>
                    <button
                      type="button"
                      onClick={() => setActiveSlide((activeSlide + 1) % step.images.length)}
                      aria-label="下一张角色设定图"
                    >→</button>
                  </div>
                  <div className="workflow-carousel-dots" aria-label="角色设定图页码">
                    {step.images.map((image, index) => (
                      <button
                        type="button"
                        key={image.src}
                        className={activeSlide === index ? "active" : ""}
                        onClick={() => setActiveSlide(index)}
                        aria-label={`查看第 ${index + 1} 张角色设定图`}
                      />
                    ))}
                  </div>
                </>
              ) : step.mediaType === "video" ? (
                <video
                  key={`${workflowCase.id}-${step.no}`}
                  src={step.media}
                  poster={step.poster}
                  controls
                  playsInline
                  preload="metadata"
                  aria-label={step.imageAlt}
                />
              ) : (
                <button
                  className="workflow-image-preview-trigger"
                  type="button"
                  onClick={() => setIsImagePreviewOpen(true)}
                  aria-label={`放大查看${step.imageAlt}`}
                >
                  <img
                    src={step.image}
                    alt={step.imageAlt}
                    style={{
                      transform: `scale(${step.imageScale})`,
                      transformOrigin: step.imageOrigin,
                      objectFit: step.imageFit || "cover",
                    }}
                  />
                  <span>点击查看大图</span>
                </button>
              )}
              <div className="workflow-frame-overlay" />
              <div className="workflow-frame-copy">
                <span>{workflowCase.sampleLabel}</span>
                <b>{step.visualTitle}</b>
                <small>{step.visualNote}</small>
              </div>
            </div>
            <div className="visual-index">{step.no}</div>
          </motion.div>
          <motion.div
            className="step-explanation"
            key={`copy-${activeStep}`}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="active-icon">{step.icon}</div>
            <div>
              <span>0{activeStep + 1} / 04</span>
              <h3>{step.zh}</h3>
              <b>{step.title}</b>
              <p>{step.description}</p>
              <div className="workflow-focus-tags">
                {step.focus.map((item) => <i key={item}>{item}</i>)}
              </div>
            </div>
          </motion.div>
          <div className="io-flow">
            <div><span>输入</span><b>{step.input}</b></div>
            <i>→</i>
            <div><span>输出</span><b>{step.output}</b></div>
          </div>
          <button className="next-cabin workflow-next" onClick={() => onNavigate(cabins[4])}>
            下一站 <b>05 / 联系我</b><span>→</span>
          </button>
        </article>
      </div>

      <section className="workflow-app-showcase" aria-labelledby="app-project-title">
        <header className="workflow-app-heading">
          <div>
            <span>独立 APP 项目</span>
            <b id="app-project-title">可交互网站作品</b>
          </div>
          <small>UI DESIGN / INTERACTIVE EXPERIENCE / FRONTEND</small>
        </header>
        <a
          className="workflow-app-preview"
          href="https://baixueaiai123.github.io/travel-where-to-go/?v=17c36a7"
          target="_blank"
          rel="noreferrer"
          aria-label="打开旅行去哪儿 APP 网站"
        >
          <span className="workflow-app-thumbnail">
            <img src="/works/app-splash/02.png" alt="旅行去哪儿 APP 网站界面缩略图" />
            <i>LIVE APP</i>
          </span>
          <span className="workflow-app-copy">
            <small>APP WEBSITE / ONLINE PROJECT</small>
            <b>旅行去哪儿</b>
            <p>目的地灵感、行程规划与路线生成体验。</p>
            <em>访问项目网站 <span>↗</span></em>
          </span>
        </a>
      </section>

      {isImagePreviewOpen && previewImages.length > 0 && (
        <motion.div
          className="artwork-lightbox workflow-image-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="流程设定图大图预览"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsImagePreviewOpen(false)}
        >
          <button
            className="lightbox-close"
            type="button"
            onClick={() => setIsImagePreviewOpen(false)}
            aria-label="关闭大图"
          >
            关闭 ×
          </button>
          <div className="lightbox-frame" onClick={(event) => event.stopPropagation()}>
            {previewImages.length > 1 && (
              <button
                className="lightbox-nav lightbox-prev"
                type="button"
                onClick={() => setActiveSlide((activeSlide - 1 + previewImages.length) % previewImages.length)}
                aria-label="查看上一张图片"
              >
                ←
              </button>
            )}
            <img
              key={previewImages[activeSlide].src}
              src={previewImages[activeSlide].src}
              alt={previewImages[activeSlide].alt}
              onClick={() => {
                if (previewImages.length > 1) {
                  setActiveSlide((activeSlide + 1) % previewImages.length);
                }
              }}
              title={previewImages.length > 1 ? "点击查看下一张" : undefined}
            />
            {previewImages.length > 1 && (
              <button
                className="lightbox-nav lightbox-next"
                type="button"
                onClick={() => setActiveSlide((activeSlide + 1) % previewImages.length)}
                aria-label="查看下一张图片"
              >
                →
              </button>
            )}
            <div>
              <span>{step.zh} · {previewImages[activeSlide].alt}</span>
              <small>
                {String(activeSlide + 1).padStart(2, "0")} / {String(previewImages.length).padStart(2, "0")}
              </small>
            </div>
          </div>
        </motion.div>
      )}
    </motion.section>
  );
}

const contactChannels = [
  { label: "邮箱", value: "15716301203@163.com", status: "邮箱通道已连接", signal: "作品投递与面试邀约", note: "用于作品投递、面试邀约与项目沟通" },
  { label: "微信", value: "yxg15716301203", status: "微信通道已连接", signal: "即时沟通与合作交流", note: "用于快速联系与进一步交流" },
  { label: "电话", value: "15716301203", status: "电话通道已连接", signal: "电话沟通与岗位联系", note: "所在地：北京，可沟通 AIGC 内容创作与 AI 漫剧岗位" },
];

function ContactCabin({ onClose, onNavigate }) {
  const [activeChannel, setActiveChannel] = React.useState(0);
  const channel = contactChannels[activeChannel];

  return (
    <motion.section
      className="cabin-page contact-cabin"
      initial={{ opacity: 0, y: 22, filter: "blur(12px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -18, filter: "blur(12px)" }}
      transition={{ duration: .68, ease: [0.16, 1, 0.3, 1] }}
      aria-labelledby="contact-title"
    >
      <div className="comm-grid" />
      <div className="cabin-scan" />
      <header className="cabin-header">
        <button className="back-to-train" onClick={onClose}><span>←</span> 返回列车</button>
        <div className="cabin-coordinate">05 车厢 / 通讯舱</div>
        <div className="cabin-live"><i /> 信号已连接</div>
      </header>

      <div className="contact-layout">
        <aside className="contact-intro">
          <div className="section-code"><span>章节 05</span><i /></div>
          <div className="section-kicker">未来通讯舱</div>
          <h2 id="contact-title">一起<br /><em>创造影像</em></h2>
          <p>如果你正在寻找 AIGC 内容创作者、AI 漫剧制作师或 AI 视觉叙事方向的合作伙伴，可以通过以下通道联系我。</p>
          <div className="comm-status">
            <div><span>状态</span><b>开放求职与合作机会</b></div>
            <div><span>回应</span><b>可接收创意 Brief</b></div>
            <div><span>任务</span><b>AI 影像故事创作</b></div>
          </div>
        </aside>

        <section className="communication-terminal" aria-label="未来通讯终端">
          <div className="terminal-shell">
            <div className="terminal-orbit orbit-alpha" />
            <div className="terminal-orbit orbit-beta" />
            <div className="signal-core">
              <i />
              <span>{channel.status}</span>
              <b>{channel.label}</b>
            </div>
            <div className="signal-wave wave-a" />
            <div className="signal-wave wave-b" />
            <div className="signal-wave wave-c" />
            <div className="terminal-readout">
              <span>当前通道</span>
              <strong>{channel.signal}</strong>
              <small>{channel.value}</small>
            </div>
          </div>
        </section>

        <aside className="contact-panel">
          <div className="panel-heading"><span>联系方式</span><small>03 条通道可用</small></div>
          <div className="channel-list">
            {contactChannels.map((item, index) => (
              <motion.button
                key={item.label}
                className={activeChannel === index ? "active" : ""}
                onClick={() => setActiveChannel(index)}
                whileHover={{ x: 5 }}
                whileTap={{ scale: .985 }}
              >
                <span>0{index + 1}</span>
                <div>
                  <b>{item.label}</b>
                  <small>{item.value}</small>
                </div>
                <i>→</i>
              </motion.button>
            ))}
          </div>
          <motion.div
            className="channel-detail"
            key={channel.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span>{channel.signal}</span>
            <h3>{channel.label}</h3>
            <b>{channel.value}</b>
            <p>{channel.note}</p>
          </motion.div>
          <button className="next-cabin contact-next" onClick={() => onNavigate(cabins[0])}>
            返回起点 <b>01 / 首页</b><span>→</span>
          </button>
        </aside>
      </div>
    </motion.section>
  );
}

function App() {
  const [activeSection, setActiveSection] = React.useState(() => window.location.hash.replace("#", "") || "home");
  const [sound, setSound] = React.useState(false);

  const selectDestination = (cabin) => {
    setActiveSection(cabin.id);
    window.history.pushState(null, "", `#${cabin.id}`);
    document.getElementById(cabin.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const goHome = () => selectDestination(cabins[0]);

  React.useEffect(() => {
    const syncHash = () => {
      const hash = window.location.hash.replace("#", "") || "home";
      setActiveSection(hash);
      document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    window.addEventListener("popstate", syncHash);
    window.addEventListener("hashchange", syncHash);
    window.setTimeout(syncHash, 80);
    return () => {
      window.removeEventListener("popstate", syncHash);
      window.removeEventListener("hashchange", syncHash);
    };
  }, []);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) setActiveSection(visible.target.id);
      },
      { threshold: [0.32, 0.55, 0.72] }
    );
    cabins.forEach((cabin) => {
      const section = document.getElementById(cabin.id);
      if (section) observer.observe(section);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <main className="app-shell">
      <Starfield />
      <div className="nebula nebula-a" />
      <div className="nebula nebula-b" />
      <div className="planet"><span /></div>
      <div className="orbit-line orbit-one" />
      <div className="orbit-line orbit-two" />
      <div className="scanline" />

      <header className="topbar">
        <a className="brand" href="#home" onClick={(event) => { event.preventDefault(); goHome(); }}>
          <span className="brand-mark">A</span>
          <span><b>AIGC</b><small>AIGC内容创作师作品集</small></span>
        </a>
        <nav className="command-nav" aria-label="主导航">
          {cabins.map((cabin) => (
            <button key={cabin.id} onClick={() => selectDestination(cabin)} className={activeSection === cabin.id ? "active" : ""}>
              {getCabinLabel(cabin).nav}
            </button>
          ))}
        </nav>
        <button className="sound-button" onClick={() => setSound((value) => !value)} aria-label="切换声音">
          <span className={sound ? "sound-on" : ""}>{sound ? "◖))" : "◖×"}</span>
          {sound ? "声音开启" : "声音关闭"}
        </button>
      </header>

      <section id="home" className="home-section">
      <section className="hero">
        <motion.div
          className="hero-copy"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.7 }}
        >
          <div className="eyebrow"><span /> 欢迎登车 <em>AI 影像航行</em></div>
          <h1 className="studio-title"><span>AIGC 内容</span><br />创作空间</h1>
          <div className="role-line director-role">AI 漫剧制作师<i /> AI Visual Storyteller</div>
          <div className="hero-director-copy">
            <p>以生成式 AI 构建角色、世界观与动态镜头。</p>
            <p>这里是一座运行中的个人数字片场。</p>
          </div>
          <div className="role-line">AI漫剧制作师 <i /> AI VISUAL STORYTELLER</div>
          <p>专注生成式 AI 视觉创作，<br />探索角色设计、动态漫制作、AI 视频生成与数字内容表达。</p>
          <div className="hero-actions">
            <button className="primary-action" onClick={() => selectDestination(cabins[2])}>
              进入影像舱 <span>→</span>
            </button>
            <span className="route-status"><i /> 宇宙航线 · 在线</span>
          </div>
        </motion.div>

        <aside className="coordinates creator-status">
          <div>
            <span>身份</span>
            <b>AIGC内容创作师</b>
          </div>
          <div>
            <span>任务</span>
            <b>创作 AI 生成的<br />视觉故事</b>
          </div>
          <div>
            <span>坐标</span>
            <b>北京 / 数字宇宙</b>
          </div>
        </aside>
      </section>

      <section className="train-stage" aria-label="选择目的地车厢">
        <div className="train-label"><span>选择你的目的车厢</span><i /></div>
        <div className="train-scroll">
          <Train onSelect={selectDestination} />
        </div>
        <div className="rail"><span /><span /></div>
        <div className="speed-trails"><i /><i /><i /><i /></div>
      </section>

      <footer className="footer">
        <div className="journey">
          {cabins.map((cabin) => (
            <button key={cabin.id} onClick={() => selectDestination(cabin)}>
              <i className={activeSection === cabin.id ? "active" : ""} />
              <span>{cabin.no}</span>
            </button>
          ))}
        </div>
        <p>点击车厢进入 <span>↗</span></p>
        <small>© 2026 AIGC 创作者</small>
      </footer>
      </section>

      <div className="long-page-sections">
        <section id="about" className="scroll-cabin"><AboutCabin onClose={goHome} onNavigate={selectDestination} /></section>
        <section id="portfolio" className="scroll-cabin"><PortfolioCabin onClose={goHome} onNavigate={selectDestination} /></section>
        <section id="workflow" className="scroll-cabin"><WorkflowCabin onClose={goHome} onNavigate={selectDestination} /></section>
        <section id="contact" className="scroll-cabin"><ContactCabin onClose={goHome} onNavigate={selectDestination} /></section>
      </div>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode><App /></React.StrictMode>
);
