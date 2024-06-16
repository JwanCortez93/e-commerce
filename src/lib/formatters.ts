const CURRENCY_FORMATTER = new Intl.NumberFormat("en-US", {
  currency: "USD",
  style: "currency",
  minimumFractionDigits: 0,
});

export const formatCurrency = (amount: number) => {
  return CURRENCY_FORMATTER.format(amount);
};

const NUMBER_FORMATTER = new Intl.NumberFormat("en-US");

export const formatNumber = (number: number) => {
  return NUMBER_FORMATTER.format(number);
};

const PERCENT_FORMATTER = new Intl.NumberFormat("en-US", { style: "percent" });

export const formatDiscountCode = ({
  discountAmount,
  isFixed,
}: {
  discountAmount: number;
  isFixed: boolean;
}) => {
  if (isFixed) {
    return formatCurrency(discountAmount);
  }
  return PERCENT_FORMATTER.format(discountAmount / 100);
};

const DATE_TIME_FORMATTER = new Intl.DateTimeFormat("en", {
  dateStyle: "medium",
  timeStyle: "short",
});

export const formatDateTime = (date: Date) => {
  return DATE_TIME_FORMATTER.format(date);
};
