import { Text as RNText, TextProps } from "react-native";

type Variant =
  | "display"
  | "h1"
  | "h2"
  | "h3"
  | "body"
  | "body-medium"
  | "caption"
  | "label";

type Props = TextProps & {
  variant?: Variant;
  className?: string;
};

const variantClasses: Record<Variant, string> = {
  display: "font-serif-bold text-bordeaux text-[34px] leading-[40px]",
  h1: "font-serif-bold text-bordeaux text-[28px] leading-[34px]",
  h2: "font-serif text-bordeaux text-[22px] leading-[28px]",
  h3: "font-sans-semibold text-ink text-[17px] leading-[22px]",
  body: "font-sans text-ink text-[15px] leading-[22px]",
  "body-medium": "font-sans-medium text-ink text-[15px] leading-[22px]",
  caption: "font-sans text-ink-muted text-[13px] leading-[18px]",
  label: "font-sans-semibold text-ocre-deep text-[12px] uppercase tracking-wider",
};

export function Text({ variant = "body", className, ...rest }: Props) {
  return (
    <RNText
      {...rest}
      className={`${variantClasses[variant]} ${className ?? ""}`}
    />
  );
}
