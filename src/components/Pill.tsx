import { View, ViewProps } from "react-native";

type Props = ViewProps & {
  variant?: "soft" | "outline" | "ocre";
};

export function Pill({ variant = "soft", className, children, ...rest }: Props) {
  const v = {
    soft: "bg-cream-warm",
    outline: "bg-transparent border border-bordeaux/20",
    ocre: "bg-ocre/10 border border-ocre/30",
  }[variant];
  return (
    <View
      {...rest}
      className={`rounded-full px-4 py-2 ${v} ${className ?? ""}`}
    >
      {children}
    </View>
  );
}
