import { Card, CardContent, Typography, CardActions, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import PropTypes from "prop-types";

export const CompanyCard = (props) => {
  return (
    <Card variant="outlined" sx={{ mb: 1 }}>
      <CardContent>
        <Typography sx={{ fontSize: 16 }} color="grey" gutterBottom>
          {props.company.blockchain}
        </Typography>
        <Typography variant="h5" component="div">
          {props.company.companyName}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="grey">
          ID: {props.company.appId}
        </Typography>
        <Typography variant="body2">
          {props.company.blockchain === "ALGORAND" ? `Vault Address: ${props.company.vaultAddress}` : ""}
        </Typography>
      </CardContent>
      <CardActions>
        <Link to={props.company.blockchain === "ALGORAND" ? `/algoCompany/${props.company.appId}` : `/ethCompany/${props.company.appId}`} style={{ textDecoration: 'none', color: 'inherit', width: "100%" }}>
          <Button size="small" >Learn More</Button>
        </Link>
      </CardActions>
    </Card>
  );
};

CompanyCard.propTypes = {
  company: PropTypes.shape({
    blockchain: PropTypes.string,
    companyName: PropTypes.string,
    appId: PropTypes.string,
    vaultAddress: PropTypes.string,
  }),
};