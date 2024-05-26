{
  /*示波器控制面板 组件 */
}
{
  /*导入 useEffect */
}
import { useEffect, useCallback } from "react";
{
  /*导入i18n组件部分 */
}
import { useTranslation } from "react-i18next";
{
  /*导入 单选框 组件 */
}
import { Radio } from "antd";
{
  /*导入 输入框 组件 */
}
import { InputNumber, Input } from "antd";
{
  /*导入 全局 信息组件 */
}
import { message } from "antd";
{
  /*导入 按钮 组件 */
}
import { Button } from "antd";
{
  /*导入 全局 状态管理 */
}
import { useSnapshot } from "valtio";
import { osChange } from "../../../store/os";
{
  /*导入 websocket */
}
import { useWebSocket } from "ahooks";
{
  /*导入 全局配置文件 */
}
import setting from "../../../../public/json/setting.json";

export default function OscilloscopePanel() {
  {
    /*定义 全局状态 快照 */
  }
  const osChangeSnap = useSnapshot(osChange);
  {
    /*i18n */
  }
  const { t } = useTranslation();
  {
    /*定义 连接 websocket */
  }
  const { readyState, sendMessage, latestMessage, disconnect, connect } =
    useWebSocket(`${setting.webSocketUrl}`);

  {
    /*创建 ws状态 */
  }
  const connectionStatus = {
    0: "正在连接",
    1: "已连接",
    2: "正在关闭",
    3: "已关闭",
  }[readyState];

  useEffect(() => {
    if (connectionStatus === "已连接") {
      message.success("WebSocket连接已建立", 3);
    }
    if (connectionStatus === "正在连接") {
      message.success("WebSocket正在连接", 3);
    }
    if (connectionStatus === "正在关闭") {
      message.success("WebSocket正在关闭", 3);
    }
    if (connectionStatus === "已关闭") {
      message.success("WebSocket连接已关闭", 3);
    }
  }, [readyState]);
  {
    /*定义 采样频率 提交函数 */
  }
  const handleSampleRateChange = useCallback(
    (value) => {
      osChange.sampleRateChange = value;
      if (sendMessage) {
        sendMessage && sendMessage(`${value}`);
      }
    },
    [sendMessage]
  );
  {
    /*定义 取样间隔 提交函数 */
  }
  const handleSampleStepChange = useCallback(
    (value) => {
      osChange.sampleStepChange = value;
      if (sendMessage) {
        sendMessage && sendMessage(`${value}`);
      }
    },
    [sendMessage]
  );
  {
    /*定义 触发方式 提交函数 */
  }
  const handleTriggerModeChange = useCallback(
    (e) => {
      osChange.triggerModeChange = e.target.value;
      if (sendMessage) {
        sendMessage && sendMessage(`${e.target.value}`);
      }
    },
    [sendMessage]
  );
  {
    /*定义 保存波形标注 提交函数 */
  }
  const handleSaveWaveInput = (e) => {
    osChange.input = e.target.value;
    osChange.uploadTime = String(Date.now());
  };

  //test
  // const messageHistory = useRef<any[]>([]);
  // messageHistory.current = useMemo(
  //   () => messageHistory.current.concat(latestMessage),
  //   [latestMessage]
  // );

  return (
    <div className="flex flex-col h-full ">
      <span className="mb-6 text-2xl text-black font-bold">
        {t("oscilloscope_panel")}
      </span>
      <div className="flex gap-4 mb-2">
        <Button
          type="primary"
          onClick={() => connect && connect()}
          disabled={readyState === 1}
        >
          {t("run")}
        </Button>

        <Button
          onClick={() => disconnect && disconnect()}
          disabled={readyState === 3}
        >
          {t("stop")}
        </Button>
        <div className="flex items-center">
          <span className="text-black">
            {t("please_enter_the_waveform_label")}：
          </span>
          <Input
            placeholder={t("give_the_waveform_a_name")}
            className="w-40 h-10 mr-4"
            onChange={handleSaveWaveInput}
          />
          <Button
            type="primary"
            onClick={() => osChange.savewave()}
            disabled={readyState === 3}
          >
            {t("save_current_waveform")}
          </Button>
        </div>
      </div>
      <div className="flex">
        <div className="mb-4 mr-6">
          <span className="mr-3 text-black">{t("sample_frequency")}</span>
          <InputNumber
            size="large"
            min={1}
            max={100000}
            className="mr-2"
            value={osChangeSnap.sampleRateChange}
            onChange={handleSampleRateChange}
          />
          /Hz
        </div>
        <div className="mb-4 text-black">
          <span className="mr-3 text-black">{t("sample_interval")}</span>
          <InputNumber
            size="large"
            min={1}
            max={100000}
            className="mr-2"
            value={osChangeSnap.sampleStepChange}
            onChange={handleSampleStepChange}
          />
          s
        </div>
      </div>
      <div className="mb-4">
        <span className="mr-3 text-black">{t("trigger_mode")}</span>
        <Radio.Group defaultValue={3} onChange={handleTriggerModeChange}>
          <Radio value={1}>{t("none")}</Radio>
          <Radio value={2}>{t("rising_edge")}</Radio>
          <Radio value={3}>{t("falling_edge")}</Radio>
          <Radio value={4}>{t("auto")}</Radio>
          <Radio value={5}>{t("once")}</Radio>
        </Radio.Group>
      </div>
      {/* <div>
        <p>received message: </p>
        {messageHistory.current.map((message, index) => (
          <p key={index} style={{ wordWrap: "break-word" }}>
            {message?.data}
          </p>
        ))}
      </div> */}
    </div>
  );
}
