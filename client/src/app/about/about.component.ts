import { Component, OnInit } from "@angular/core";
import {TeamMember} from "../../Models/TeamMember";

const PATH_TO_MEMBERS_PICTURES: string = "../../assets/members/";
const ANOIR_URL: string = PATH_TO_MEMBERS_PICTURES + "anoir.jpg";
const THOMAS_URL: string = PATH_TO_MEMBERS_PICTURES + "thomas.png";
const YURI_URL: string = PATH_TO_MEMBERS_PICTURES + "yuri.png";

@Component({
  selector: "app-about",
  templateUrl: "./about.component.html",
  styleUrls: ["./about.component.css"],
})
export class AboutComponent implements OnInit {

  public members: Array<TeamMember>;

  public ngOnInit(): void {
    this.members = new Array<TeamMember>();
    const anoir: TeamMember = {fullName: "Anwar Boujja", matricule: "9999999", profilePictureURL: ANOIR_URL};
    this.members.push(anoir);
    const thomas: TeamMember = {fullName: "Thomas Camiré", matricule: "1897784", profilePictureURL: THOMAS_URL};
    this.members.push(thomas);
    const yuri: TeamMember = {fullName: "Yuri Azar", matricule: "1780762", profilePictureURL: YURI_URL};
    this.members.push(yuri);
  }

}
