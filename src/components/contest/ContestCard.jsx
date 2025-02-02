import React from "react";

const ContestCards = ({ contests }) => {
  return (
    <div className="contest-cards">
      {contests.map((contest) => (
        <Card key={contest.id}>
          <img
            src={contest.image}
            alt="Contest Banner"
            className="contest-image"
          />
          <CardContent>
            <p className="contest-description">{contest.description}</p>
            <div className="contest-info">
              <span className="contest-designers">👤 {contest.designers} Designers</span>
              <span className="contest-designs">🌟 {contest.designs} Designs</span>
              <span className="contest-prize">{contest.prize}</span>
            </div>
            <Button className="button-enter">Enter Contest</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ContestCards;