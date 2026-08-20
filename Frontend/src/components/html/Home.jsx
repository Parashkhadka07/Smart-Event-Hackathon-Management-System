import React from "react";
import "../css/home.css";
import Button from "../html/Button.jsx";
import photo1 from "../../assets/images/photo1.avif"
import photo2 from "../../assets/images/photo2.avif"
import photo3 from "../../assets/images/photo3.avif"
const Home = () => {
  return (
    <>
      <div className="hero">
        <div className="left">
          <div className="top">
            <div className="new">NEW</div>
            <div className="top_text">
              AI-Powered Project Submissions & Multi-Judge Rubrics
            </div>
          </div>

          <div className="big_text">
            <p className="textfs"> Turn Ideas Into</p>
            <p className="cloured_text">Innovation</p>{" "}
            <p className="text">& Breakthroughs</p>
          </div>
          <div className="hero_text">
            NerdHub empowers hackathon organizers, mentors, and developers
            <br /> to collaborate, submit verified code, and compete seamlessly
            with live <br />
            automated leaderboards.
          </div>
          <div className="hero_button">
            <Button name="Explore Events" height="50px" width="150px" />
            <Button name="Host an Event" height="50px" width="150px" />
          </div>
          <hr />
          <div className="public_proof">
            <div>
              <img
                className="images_hero"
                src={photo1}
                alt="User"
              />
              <img
                className="images_hero"
                src={photo2}
                alt="User"
              />
              <img
                className="images_hero"
                src={photo3}
                alt="User"
              />
            </div>
            <span>
              Joined by <strong>2,500+ developers</strong> across top
              universities & tech companies.
            </span>
          </div>
        </div>
        <div className="right">
          <div className="BOX">
            <div className="circle">
              <div className="red_circle"></div>
              <div className="yellow_circle"></div>
              <div className="green_circle"></div>
            </div>
            <div className="box_top">
              <div>nerdhub-live-hackathon.ts</div>
              <div className="live_text">LIVE</div>
            </div>
          </div>
          <hr style={{ margin: "0 30px 0 20px" }} />

          <div className="status">
            <div>// Active Hackathon: CodeSprint Global 2026</div>
            <div>
              <span className="status_box">Status:</span>
              <span className="jug"> JUDGING_IN_PROGRESS</span>
            </div>
            <div>
              Submissions: <span className="projects"> 142 Projects</span>
            </div>
          </div>
          <div className="sanskar_div">
            <div className="progess_status">
              <div className="progress_text">
                <strong>Current Top Team: Team NeuralCraft</strong>
              </div>
              <div className="progress_point">98.5 pts</div>
            </div>
            <div className="progress">
              <div className="progressfill"></div>
            </div>
          </div>
          <div className="basnet_don">
            <div>
              <div>
                <strong>Prize Pool</strong>
              </div>
              <div>$15,000 + Cloud Credits</div>
            </div>
            <div>
              <div>
                <Button name="View Event" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="total_events">
        <div className="data">
          <div  className="number hosted">120+</div>
          <div className="number_text">Events Hosted</div>
        </div>
        <div className="data">
          <div className="number active">2,500+</div>
          <div className="number_text">Active Participants</div>
        </div>
        <div className="data">
          <div className="number teams">600+</div>
          <div className="number_text">Teams Formed</div>
        </div>
        <div className="data">
          <div className="number project" >1,200+</div>
          
          <div className="number_text">Projects Built</div>
        </div>
      </div>
    </>
  );
};

export default Home;
