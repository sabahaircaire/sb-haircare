import { TextInput, TextInputProps, View } from "react-native";
import { Text } from "./Text";
import { colors } from "@/theme/colors";

type Props = TextInputProps & {
  label?: string;
};

export function Input({ label, className, style, ...rest }: Props) {
  return (
    <View>
      {label ? (
        <Text variant="label" className="mb-2">
          {label}
        </Text>
      ) : null}
      <TextInput
        placeholderTextColor={colors.ink.muted}
        {...rest}
        style={[
          {
            backgroundColor: colors.cream.light,
            borderColor: colors.cream.warm,
            borderWidth: 1,
            borderRadius: 16,
            paddingHorizontal: 16,
            paddingVertical: 14,
            fontFamily: "Inter_400Regular",
            fontSize: 15,
            color: colors.ink.DEFAULT,
          },
          style,
        ]}
        className={className}
      />
    </View>
  );
}
