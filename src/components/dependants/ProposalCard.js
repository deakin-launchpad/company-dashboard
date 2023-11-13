/* eslint-disable no-unused-vars */
import { Card, CardContent, Typography, CardActions, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import PropTypes from "prop-types";

export const ProposalCard = (props) => {
  return (
    <Card variant="outlined" sx={{ mb: 1 }}>
      <CardContent>
        <Typography sx={{ fontSize: 16 }} color="grey" gutterBottom>
          {props.proposal.phase}
        </Typography>
        <Typography variant="h5" component="div">
          {props.proposal.name}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="grey">
          {props.proposal.description}
        </Typography>
        <Typography variant="body2">
          Governance Token: {props.proposal.governanceToken}
        </Typography>
      </CardContent>
      {/* <CardActions>
        <Link to={props.proposal.blockchain === "ALGORAND" ? `/algoCompany/${props.proposal.appId}` : `/ethCompany/${props.proposal.appId}`} style={{ textDecoration: 'none', color: 'inherit', width: "100%" }}>
          <Button size="small" >Learn More</Button>
        </Link>
      </CardActions> */}
    </Card>
  );
};

ProposalCard.propTypes = {
  proposal: PropTypes.shape({
    phase: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
    governanceToken: PropTypes.number,
  }),
};