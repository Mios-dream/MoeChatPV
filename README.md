# MoeChat 宣传视频 (PV)

基于 [Remotion](https://www.remotion.dev/) 生成的 1920×1080 横屏宣传视频，目标观众为 B 站二次元用户，整体采用项目主题色（粉色 / 白色），图标使用 Font Awesome（免费开源图标库，与应用内一致）。

## 成片

- `out/moechat-pv-chino.mp4` — 最终成片（H.264 + AAC，30fps，约 105.5 秒）

## 视频结构（v2）

| 时间段 | 场景 | 内容 |
| --- | --- | --- |
| 00:00–00:09 | 开场 | 开幕台词（保留原句）+ 旋转樱花 → 项目名与图标 |
| 00:09–00:21 | 角色展示 | 项目 Live2D 模型实时驱动动画 + 摄像机运镜，标志性台词「哼，杂鱼哥哥，欢迎回来！」 |
| 00:21–00:45 | 聊天展示 | Live2D 头部特写为画面中心，逐条回应 3 个类别（摸摸头 / 天气提醒 / 睡眠模式），回复与左侧标签切换均带交叉淡入淡出，背景带旋转花朵 |
| 00:45–00:57 | 聊天情景 | 时间线：早安 → 白天 → 深夜 → 晚安，助手空间的朋友们可换着陪伴（Live2D 语音） |
| 00:57–01:09 | 低占用模式 | Live2D 真实睡眠状态：闭眼小憩 → 被叫到时半睁眼回答 → 再睡回去；低占用数据退到角落小卡（`--sleep` 素材） |
| 01:08–01:17 | 她的日记本 | 日记 / 主页·状态双标签窗口（视频标签带淡入淡出切换），她护着日记不给看（Live2D 语音） |
| 01:17–01:31 | 小组件演示 | 纯小组件演示：时钟 / 天气 / 每日一句 / 任务板 / 便签（Live2D 语音为对应场景的日常回复） |
| 01:30–01:58 | 结尾 | MoeChat 品牌信息、开源说明与 GitHub 链接 |

> 注：v3 起去掉了花瓣 / 爱心飘落动效；开屏改为台词 + 旋转樱花 + Logo；并集成了项目同款 Live2D 模型。后续版本统一为角色驱动的连续叙事：全片字幕只有智乃台词、无旁白；**全片统一为「哥哥」人设口吻（开幕词除外）**；每个场景都有角色在场；转场统一使用淡入淡出；所有场景统一使用白色斜纹 + 星点背景（`StripedStage`）。助手语音均为贴合人设卡（傲娇、口是心非）的日常回复，不介绍界面；素材脚本支持 `--sleep` 睡眠模式（眼部按口型半睁/闭合 + 压低动作幅度）。

## Live2D 集成

- 使用与应用一致的 `untitled-pixi-live2d-engine`（PixiJS v8）预渲染项目内模型（`public/live2d/重置版智乃/`）。
- 同时加载 Cubism 2（`live2d.min.js`）与 Cubism 5（`live2dcubismcore.min.js`）两个运行时，并按 Remotion 帧时钟逐帧驱动动作（`src/live2d/Live2DStage.tsx`），保证渲染确定性与 Studio 预览可用。
- 动作来自模型自带的 Idle 组（`idle_1`、`Hiyori_m02/m03/m07/m08`），按时间轴依次切换；角色右侧 + 左侧功能演示窗口（聊天 / 待办 / 天气 / 日记）。

### 预渲染角色素材

主 PV 不再直接在多线程渲染时驱动 Live2D。角色会先以单线程渲染为带 Alpha 的 **4K（3840×3840）WebM**，再由主时间线合成，从而避免 Cubism 物理和眨眼状态在并行帧之间跳变，同时保证头部特写放大后依然清晰。合成命令带 `--gl=angle`，让 Chromium 在无头模式下使用 GPU（WebGL / 视频解码 / 阴影渐变均走硬件加速）。角色亮相使用 `showcase-intro`，功能阶段使用 `feature-chat`；最终视频静音合成，配音从同目录 WAV 独立挂载。

Remotion Studio 预览时使用同目录的轻量代理素材 `character-preview.webm`（1280×1280，约 1MB），CLI 导出则使用 4K 主素材 `character.webm`，两者由 `CharacterClip` 按 `remotion_isStudio` 自动选择——预览不卡、导出不糊。代理素材由素材脚本在合成 4K 主素材后自动生成，无需手动处理。

模型只从 `public/live2d/重置版智乃/` 读取，脚本不会改动应用项目或模型文件。生成的素材保存在 `public/live2d-generated/<name>/`，包含 `source.json`、可选的 `voice.wav` 与 `character.webm`。

```bash
# 使用后端生成语音 + 动作，并渲染带透明通道的视频
npm run live2d:asset -- --name greeting --text "欢迎回来，阁下，今天也要一起加油哦！"

# 只生成可循环的待机角色素材（主 PV 默认使用这个名称）
npm run live2d:asset -- --name hero-idle --seconds 20 --no-tts --no-motion

# 需要在传统剪辑软件中抠像时，输出纯绿幕 H.264 视频
npm run live2d:asset -- --name greeting-key --text "欢迎回来，阁下" --background chroma

# 使用已有音频 / 动作配置重新渲染（不会请求后端）
npm run live2d:asset -- --name feature-chat --text "想聊天、查天气，还是记下今天的心情？告诉我吧。" --from-props public/live2d-generated/feature-chat/render-props.json --seconds 12
```

后端默认地址为 `http://127.0.0.1:8001`，可通过 `--api-base` 覆盖。透明素材使用 VP9 + Alpha；脚本始终使用 `--concurrency=1`，保证同一个 Live2D 实例按帧顺序推进。语音文件会被分析为口型强度曲线，和 `/api/generate_motion` 返回的动作曲线一起写入独立素材。

## 常用命令

```bash
npm run dev          # 打开 Remotion Studio 实时预览
npm run still        # 渲染单帧（预览布局）
npm run render       # 渲染最终 MP4（--gl=angle GPU 渲染 + NVENC 硬件编码）
```

> 制作规范：修改代码后默认只做语法级验证，不自动截图、完整渲染或导出视频。修改结果通过 Remotion Studio 网页实时预览；PV 全部完成且用户明确要求时才执行 `npm run render`。详细约定见 [`AGENTS.md`](./AGENTS.md)。

## 自定义与素材接入

- **图标**：全部使用 Font Awesome Free Solid（`src/icons.tsx` 统一注册），无 emoji。
- **实机录像**：`public/video/clips/` 下的 6 段裁剪片段分别用于“聊天 / 桌宠 / 待办 / 天气 / 日记 / 主页”场景（用 ffmpeg 预裁剪，避免运行时裁剪导致黑帧），默认静音（`muted`）；如需保留录像原声，去掉 `muted` 即可。原始录屏存放在 `pv/media-original/`（不参与打包），重新裁剪的命令示例：

  ```bash
  ffmpeg -ss 4 -t 9 -i media-original/chat-demo.mp4 -c:v libx264 -crf 18 -pix_fmt yuv420p -c:a aac public/video/clips/chat.mp4
  ```
- **BGM / 配音**：把音频文件放入 `public/`，在 `src/MoeChatPV.tsx` 中加一行 `<Audio src={staticFile("music.mp3")} />` 即可；如提供配音，可以把底部字幕与语音逐句同步。
- **正式角色素材**：`public/images/mascot.png` 为项目角色立绘（Q 版），替换该文件即可换形象。
- **新截图**：`public/images/` 下的主页 / 助手空间 / 助手管理 / 小组件管理 / 设置页 / 聊天历史 / 日记功能等截图可随时替换进各场景。
- **场景 / 文案**：字幕文案集中在 `src/captions.ts`，场景参数集中在 `src/MoeChatPV.tsx`。

## 目录结构

```
pv/
├── src/
│   ├── scenes/        # 各场景组件（10 个场景）
│   ├── MoeChatPV.tsx  # 总合成：转场、字幕、音效
│   ├── captions.ts    # 字幕文案与时间轴
│   ├── fx.tsx         # 背景动效（樱花、星光、光斑、爱心）
│   ├── ui.tsx         # 窗口、气泡、卡片等 UI 组件
│   ├── mascot.tsx     # 澪酱角色组件
│   ├── icons.tsx      # Font Awesome 图标注册
│   └── Root.tsx       # 1920×1080 合成注册
├── public/
│   ├── fonts/         # 项目同款字体（大萌卡通体 / 三极圆体简 / 萝莉体）
│   ├── images/        # 角色立绘、应用截图（含新增截图）
│   ├── video/         # 实机录屏素材
│   └── sfx/           # 生成的小音效（pop / ding）
└── out/               # 渲染产物
```
