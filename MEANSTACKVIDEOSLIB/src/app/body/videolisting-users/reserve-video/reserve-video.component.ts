import { Component, OnInit } from '@angular/core';
import { VideolistServiceService } from '../../../Services/videolist-service.service';
import { Videos } from '../videos.model';
import { ActivatedRoute, Params } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Customer } from '../../videolisting-admin/customerlist/customer.model';
import { CustomerService } from 'src/app/Services/customer.service';

@Component({
  selector: 'app-reserve-video',
  templateUrl: './reserve-video.component.html',
  styleUrls: ['./reserve-video.component.css'],
  providers: []
})
export class ReserveVideoComponent implements OnInit {
  videos: Videos[];
  fileName = "default.png";//to avoid error initialize defalut value
  imgpath = "../../../../assets/";
  videotobeReserved: Videos = { title: "", runtime: "", genre: "", rating: "", director: "", status: "", imgPath: "" };//assigning this default object to avoid error in life cyle hook
  indexparm = this.route.snapshot.params['index'];
  clicked = false;

  customers: Customer[];
  constructor(private route: ActivatedRoute, private http: HttpClient, private videoservice: VideolistServiceService, private customerService: CustomerService) {

  }

  ngOnInit() {
    this.customerService.getCustomers()
      .subscribe((custs) => {
        this.customers = custs
      })
    // this.customers=[new Customer("far","fd","d","df","df","df")];
    // console.log(this.customers[0].firstName)
    this.videoservice.getVideolist()
      .subscribe((vids) => {
        this.videos = vids;
        for (let i = 0; i < this.videos.length; i++) {
          if (this.indexparm == i) {
            this.videotobeReserved = this.videos[i];
            this.fileName = this.videotobeReserved.imgPath;
          }
        }

      })

  }

  reserveVideos(id) {

    this.videoservice.reserveVideo(id)
      .subscribe();
    this.clicked = true;

  }

}
