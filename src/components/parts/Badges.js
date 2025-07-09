import {
  AlertCircle,
  Ban,
  CheckCircle,
  Circle,
  Clock,
  Eye,
  EyeOff,
  Lock,
  Star,
} from "lucide-react";
import { Badge } from "../ui/badge";

export function StatusBadge({ status }) {
  const map = {
    active: {
      color: "bg-green-100 text-green-700",
      icon: <CheckCircle className="h-3 w-3" />,
    },
    inactive: {
      color: "bg-yellow-100 text-yellow-800",
      icon: <Clock className="h-3 w-3" />,
    },
    closed: {
      color: "bg-gray-200 text-gray-700",
      icon: <Ban className="h-3 w-3" />,
    },
    draft: {
      color: "bg-blue-100 text-blue-700",
      icon: <AlertCircle className="h-3 w-3" />,
    },
  };

  const item = map[status] || {
    color: "bg-muted text-muted-foreground",
    icon: <Circle className="h-3 w-3" />,
  };

  return status ? (
    <Badge className={`capitalize gap-1 px-2 py-1 ${item.color}`}>
      {item.icon}
      {status}
    </Badge>
  ) : (
    <span>--</span>
  );
}

export function VisibilityBadge({ visibility }) {
  const map = {
    public: {
      color: "bg-green-50 text-green-700",
      icon: <Eye className="h-3 w-3" />,
    },
    private: {
      color: "bg-gray-100 text-gray-700",
      icon: <Lock className="h-3 w-3" />,
    },
    premium: {
      color: "bg-yellow-50 text-yellow-800",
      icon: <Star className="h-3 w-3 fill-yellow-500" />,
    },
    draft: {
      color: "bg-blue-50 text-blue-700",
      icon: <EyeOff className="h-3 w-3" />,
    },
  };

  const item = map[visibility] || {
    color: "bg-muted text-muted-foreground",
    icon: <Eye className="h-3 w-3" />,
  };

  return visibility ? (
    <Badge className={`capitalize gap-1 px-2 py-1 ${item.color}`}>
      {item.icon}
      {visibility}
    </Badge>
  ) : (
    <span>--</span>
  );
}
