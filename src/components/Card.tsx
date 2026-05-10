import { View, ViewProps } from "react-native";

type Props = ViewProps & {
  variant?: "default" | "bordeaux" | "outline";
};

export function Card({
  variant = "default",
  className,
  children,
  ...rest
}: Props) {
  const variantClasses = {
    default: "bg-cream-light",
    bordeaux: "bg-bordeaux",
    outline: "bg-cream-light border border-cream-warm",
  };

  return (
    <View
      {...rest}
      className={`rounded-2xl p-4 ${variantClasses[variant]} ${className ?? ""}`}
    >
      {children}
    </View>
  );
}
