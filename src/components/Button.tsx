import { Pressable, PressableProps, Text } from "react-native";

type Variant = "primary" | "secondary" | "ghost";

type Props = PressableProps & {
  variant?: Variant;
  label: string;
};

export function Button({
  variant = "primary",
  label,
  className,
  ...rest
}: Props) {
  const containerClasses = {
    primary: "bg-bordeaux active:bg-bordeaux-deep",
    secondary: "bg-cream-warm active:bg-cream",
    ghost: "bg-transparent border border-bordeaux active:bg-cream-warm",
  };

  const textClasses = {
    primary: "text-white",
    secondary: "text-bordeaux",
    ghost: "text-bordeaux",
  };

  return (
    <Pressable
      {...rest}
      className={`rounded-full px-6 py-4 items-center justify-center ${containerClasses[variant]} ${className ?? ""}`}
    >
      <Text
        className={`font-sans-semibold text-[15px] ${textClasses[variant]}`}
      >
        {label}
      </Text>
    </Pressable>
  );
}
