import { Component } from '@angular/core';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  searchTerm: string = '';
  videos = [
    { title: 'Video 1', description: 'Descripción del video 1', url: 'https://example.com/video1' },
    { title: 'Video 2', description: 'Descripción del video 2', url: 'https://example.com/video2' },
    { title: 'Video 3', description: 'Descripción del video 3', url: 'https://example.com/video3' },
  ];
  filteredVideos = [...this.videos];

  constructor() {}

  filterVideos() {
    const term = this.searchTerm.toLowerCase();
    this.filteredVideos = this.videos.filter(video =>
      video.title.toLowerCase().includes(term) || video.description.toLowerCase().includes(term)
    );
  }

  playVideo(video: any) {
    console.log(`Reproduciendo: ${video.title}`);
    // Aquí puedes agregar la lógica para reproducir el video
    // Por ejemplo, navegar a una página de reproducción o abrir un modal
  }
}
