import React from "react";
import "../css/home.css";
import Button from "../../components/html/Button.jsx";
import photo1 from "../../assets/images/photo1.avif";
import photo2 from "../../assets/images/photo2.avif";
import photo3 from "../../assets/images/photo3.avif";
import Navbar from "../../components/html/navbar.jsx";
import { Footer } from "../../components/html/footer.jsx";
const Home = () => {
  return (
    <>
    <Navbar/>
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
              <img className="images_hero" src={photo1} alt="User" />
              <img className="images_hero" src={photo2} alt="User" />
              <img className="images_hero" src={photo3} alt="User" />
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
          <div className="number hosted">120+</div>
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
          <div className="number project">1,200+</div>

          <div className="number_text">Projects Built</div>
        </div>
      </div>
      <div className="home_bottom">
        <div>
          <div className="bottom_big_text">How NerdHub Works</div>
          <div className="bottom_small_text">
            <strong>
              A seamless journey from initial idea generation to real-time
              evaluation and leaderboard recognition.
            </strong>
          </div>
        </div>
        <div className="box_container">
          <div className="boxes">
            <div className="bignumber">1</div>
            <div className="bigtext_bottom">Discover</div>
            <div className="small_text_bottom">
              Browse online or in-person hackathons based on technologies,
              dates, and prizes.
            </div>
          </div>
          <div className="boxes">
            <div className="bignumber">2</div>
            <div className="bigtext_bottom">Register</div>
            <div className="small_text_bottom">
              Sign up solo or form/join a cross-functional team with automated
              invite codes.
            </div>
          </div>
          <div className="boxes">
            <div className="bignumber">3</div>
            <div className="bigtext_bottom">Build</div>
            <div className="small_text_bottom">
              Connect with assigned mentors, participate in office hours, and
              write clean code.
            </div>
          </div>
          <div className="boxes">
            <div className="bignumber">4</div>
            <div className="bigtext_bottom">Submit</div>
            <div className="small_text_bottom">
              Upload code repositories, live demo links, presentations, and
              solution blueprints.
            </div>
          </div>
          <div className="boxes">
            <div className="bignumber">5</div>
            <div className="bigtext_bottom">Compete</div>
            <div className="small_text_bottom">
              Get scored by judges on innovation, tech stack, and UI to win
              prizes on live leaderboards.
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default Home;
