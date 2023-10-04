import { Card, CardContent, Typography, CardActions, Button } from '@mui/material';
import { Link } from 'react-router-dom';


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
              {company.blockchain === "ALGORAND" ? `Vault Address: ${company.vaultAddress}` : ""}
            </Typography>
          </CardContent>
          <CardActions>
            <Link to={company.blockchain === "ALGORAND" ? `/algoCompany/${company.appId}` : `/ethCompany/${company.appId}`} style={{ textDecoration: 'none', color: 'inherit', width: "100%" }}>
              <Button size="small" >Learn More</Button>
            </Link>
          </CardActions>
        </Card>
      );
    })
  );
};