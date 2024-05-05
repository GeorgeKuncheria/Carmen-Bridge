import React from "react"
import { Container } from "react-bootstrap"
import { Link } from "react-router-dom";
import { FontAwesome } from "react-icons/fa";
import { FaHeadphonesAlt } from 'react-icons/fa';
import { FaHome } from 'react-icons/fa';
import { FaPlay } from 'react-icons/fa';
import { FaSearch } from 'react-icons/fa';
import { FaBell } from 'react-icons/fa';
import { FaComment } from 'react-icons/fa';
import { FaUser } from 'react-icons/fa';
import { FaDoorOpen } from 'react-icons/fa';


const AUTH_URL =
  "https://accounts.spotify.com/authorize?client_id=055c89aa39fc491dac54b69d0dfdf2a9&response_type=code&redirect_uri=http://localhost:3000&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state"
const HOME = "http://localhost:5000"

export default function Login() {
  return (
    <>
    <div className="row">
    <Container style={{ display:"flex", flexDirection:"column", marginTop: '15px', width:"10%", marginLeft:'12%'}}
    >
      <a href="http://127.0.0.1:8000/" style={{color:"green", fontSize:"30px", margin:"5px"}}><FaHeadphonesAlt /></a>
      <a href={HOME} style={{color:"#414240", fontSize:"30px", margin:"5px"}}><FaHome  /></a>
      <a href="http://localhost:5000/music" style={{color:"#414240", fontSize:"30px", margin:"5px"}}><FaPlay  /></a>
      <a href="http://localhost:5000/search" style={{color:"#414240", fontSize:"30px", margin:"5px"}}><FaSearch  /></a>
      <a href="http://localhost:5000/notifications" style={{color:"#414240", fontSize:"30px", margin:"5px"}}><FaBell  /></a>
      <a href="http://localhost:5000/messages" style={{color:"#414240", fontSize:"30px", margin:"5px"}}><FaComment  /></a>
      <a href="http://localhost:5000/profile" style={{color:"#414240", fontSize:"30px", margin:"5px"}}><FaUser  /></a>
      <a href= "/logout" style={{color:"#414240", fontSize:"30px", margin:"5px"}}><FaDoorOpen  /></a>

    
    </Container>
    {/* <Link className="green" to="/"><i class="cid-headphones"></i></Link> */}
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <a
      style={{marginLeft:"-60%", 
      marginTop:"-25%",
      border: "3px solid green",
      fontWeight: 400, 
      letterSpacing: '1px',
      color:'green', 
      fontSize:'20px',
      borderRadius:'40px',
      padding:'10px 20px'}}
      href={AUTH_URL}> PLAY MUSIC WITH SPOTIFY <i class="fab fa-spotify"></i></a>
    </Container>
    </div>
    </>
  )
}
