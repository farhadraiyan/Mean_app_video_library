import { Component, OnInit, ViewChild } from '@angular/core';
import { Videos } from '../../videolisting-users/videos.model';
import { VideolistServiceService } from '../../../Services/videolist-service.service';
import { NgForm } from '@angular/forms';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { generate } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { CategoryandratingService } from 'src/app/Services/categoryandrating.service';
@Component({
  selector: 'app-update-video',
  templateUrl: './update-video.component.html',
  styleUrls: ['./update-video.component.css']
})
export class UpdateVideoComponent implements OnInit {
  starsRating: String[];
  category: String[];
  selctedFile: File = null;
  indexparm = this.route.snapshot.params['index'];
  videos: Videos[];
  fileName: String;//to avoid error initialize defalut value
  imgpath = "src/assets/";
  ImgName: String;
  videotobeEdited: Videos = { title: "", runtime: "", genre: "", rating: "", director: "", status: "", imgPath: "" };//assigning this default object to avoid error in life cyle hook
  emptyField=false;

  constructor(private Cate_rating_serv: CategoryandratingService, private cookieservice: CookieService, private router: Router, private route: ActivatedRoute, private http: HttpClient, private videoservice: VideolistServiceService) { }

  ngOnInit() {

    this.Cate_rating_serv.category.subscribe((cat_ratings) => {
      this.category = cat_ratings[0]
      this.starsRating = cat_ratings[1]
    })

    //checking user login status if not logged in redirect
    if (this.cookieservice.get("login") == "") {
      this.router.navigate(['']);
    }

    this.videoservice.getVideolist()
      .subscribe((vids) => {
        this.videos = vids;
        for (let i = 0; i < this.videos.length; i++) {
          if (this.indexparm == i) {
            this.videotobeEdited = this.videos[i];
            this.ImgName = this.videotobeEdited.imgPath;

          }
        }

      })
    //assigning image path
    if (this.videotobeEdited.imgPath == "") {
      this.ImgName = "default.png";
    }
    else {
      this.ImgName = this.videotobeEdited.imgPath;
    }



  }


  onFileSelect(event) {
    this.selctedFile = <File>event.target.files[0];
    this.fileName = this.selctedFile.name;//assign filename on user selct
  }

  addPhoto()
  {
     //this condition to avoid image error when file not selected
    if(this.selctedFile)
    {
    //uploading image is working independtly , i am not creating a extra collections for img object 
    this.videoservice.addPhoto(this.selctedFile)
    .subscribe(res=>console.log(res))
    }

    

  }

  updateVideo(title, director, run,gen, star, stat, id) {

    if(this.isEmpty(title.value, director.value, run.value,gen.value, star.value, stat.value))
    {
      this.emptyField=true;

    }
    else{
      let updatedVid = {
        _id: id, title: title.value, runtime: run.value, genre: gen.value,
        rating: star.value, director: director.value, status: stat.value, imgPath: this.fileName
      };
      this.videoservice.updateVideo(updatedVid)
        .subscribe(data => {
          console.log(updatedVid);
          this.videos[this.indexparm] = data
          this.router.navigate(['/videolist']);
        });

    }


  }
  isEmpty(t,d,r,g,sr,st):boolean{
    if(t=="" || d=="" || r=="" || g=="" || sr=="" ||st=="")
    {
      return true;
    }

    return false;
  }

}
