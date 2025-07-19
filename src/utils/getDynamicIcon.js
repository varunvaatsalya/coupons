// utils/getDynamicIcon.js
import * as Fa from "react-icons/fa";
import * as Fa6 from "react-icons/fa6";
import * as Ai from "react-icons/ai";
import * as Md from "react-icons/md";
import * as Bs from "react-icons/bs";
import * as Bi from "react-icons/bi";
import * as Ci from "react-icons/ci";
import * as Fi from "react-icons/fi";
import * as Gi from "react-icons/gi";
import * as Rx from "react-icons/rx";
import * as Io5 from "react-icons/io5";
import * as Ri from "react-icons/ri";
import * as Tb from "react-icons/tb";
import * as Si from "react-icons/si";
import * as Pi from "react-icons/pi";
import * as Ti from "react-icons/ti";
import * as Wi from "react-icons/wi";

const modules = {
  fa: Fa,
  fa6: Fa6,
  ai: Ai,
  md: Md,
  bs: Bs,
  bi: Bi,
  ci: Ci,
  fi: Fi,
  gi: Gi,
  rx: Rx,
  io5: Io5,
  ri: Ri,
  tb: Tb,
  si: Si,
  pi: Pi,
  ti: Ti,
  wi: Wi,
};

export function getDynamicIconComponent(icon, size=28) {
  if (!icon || typeof icon !== "string") return null;

  const [lib, iconName] = icon.split("/");

  const IconLib = modules[lib.toLowerCase()];
  const IconComponent = IconLib?.[iconName];

  if (!IconComponent) return null;

  return <IconComponent size={size} />;
}

export function isValidIconFormat(icon) {
  const regex = /^[a-z0-9]+\/[A-Z][a-zA-Z0-9]+$/;
  return regex.test(icon);
}
