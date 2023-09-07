import { Card, CardContent, Typography, CardActions, Button } from '@mui/material';

export const CompaniesList = (props) => {
  return (
    props.companies.map((company) => {
      return (
        <Card variant="outlined" key={company._id}>
          <CardContent>
            <Typography sx={{ fontSize: 14 }} color="grey" gutterBottom>
              {company.appId}
            </Typography>
            <Typography variant="h5" component="div">
              {company.companyName}
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="grey">
              {company.role}
            </Typography>
            <Typography variant="body2">
              Vault Address: {company.vaultAddress}
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small">Learn More</Button>
          </CardActions>
        </Card>
      );
    })
  );
};