// src/app/components/auth/LabeledInput.tsx
import { Box, Typography, TextField, TextFieldProps } from '@mui/material';

type Props = { label: string } & TextFieldProps;

export default function LabeledInput({ label, ...props }: Props) {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography sx={{ color: '#6B5B4A', fontWeight: 500, fontSize: 16, mb: 0.5, ml: 0.5 }}>
        {label}
      </Typography>
      <TextField
        fullWidth
        variant="outlined"
        InputProps={{
          disableUnderline: true,
          sx: { bgcolor: '#DDD8D1', borderRadius: 2, fontSize: 16, px: 1.5, py: 0.5 },
        }}
        {...props}
      />
    </Box>
  );
}