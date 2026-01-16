import { Switch, Typography, Box } from '@mui/material';

export default function ToggleSwitch({statusName, checked, onChange}) {
  //const [checked, setChecked] = React.useState(true);

  return (
    <Box display="flex" alignItems="center" gap={1}>
       <label className="block text-gray-700 text-xs font-xs">{statusName} status*</label>
      <Switch checked={checked} onChange={onChange} inputProps={{ 'aria-label': 'Switch demo' }} />
      <Typography variant="body2" color={checked ? "green" : "red"}>
        {checked ? "Active" : "Inactive"}
      </Typography>
    </Box>
  );
}
