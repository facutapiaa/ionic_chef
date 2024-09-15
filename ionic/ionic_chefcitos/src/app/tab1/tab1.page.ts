import { Component, OnInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { ToastController, ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: './tab1.page.html',
  styleUrls: ['./tab1.page.scss'],
})
export class Tab1Page implements OnInit {
  // Obtener las referencias de los videos dentro del DOM
  @ViewChildren('videoPlayer') videoPlayers!: QueryList<ElementRef>;

  // Lista de videos cargados
  videos: any[] = [];
  // Total de videos simulados (esto se puede cambiar para cargar dinámicamente más videos)
  totalVideos: number = 15;
  // IntersectionObserver para detectar cuando los videos están visibles
  observer!: IntersectionObserver;

  constructor(
    private toastController: ToastController,
    private actionSheetController: ActionSheetController
  ) { }

  ngOnInit() {
    // Cargar los videos iniciales cuando se carga la página
    this.loadInitialVideos();

    // Configurar IntersectionObserver para observar cuando los videos son visibles
    this.observer = new IntersectionObserver(this.handleIntersection.bind(this), {
      threshold: 0.75, // El 75% del video debe ser visible para que se active
    });

    // Agregar los videos al observador después de que se rendericen
    setTimeout(() => {
      this.videoPlayers.forEach((videoPlayer) => {
        this.observer.observe(videoPlayer.nativeElement);
      });
    }, 1000); // Espera un segundo para que todos los videos se hayan cargado
  }

  // Agregar observador a los videos visibles
  observeVideos() {
    this.videoPlayers.forEach((videoPlayer) => {
      this.observer.observe(videoPlayer.nativeElement);
    });
  }

  // Simular la carga de los primeros 5 videos
  loadInitialVideos() {
    for (let i = 0; i < 5; i++) {
      this.videos.push({
        id: i + 1,
        url: `assets/videos/video${i + 1}.mp4`,
        liked: false,
        favorited: false,
        showComments: false,
        isPlaying: false,
        user: {
          name: `Usuario ${i + 1}`,
          photo: `assets/users/user${i + 1}.jpg`, // Asegúrate de tener las fotos en la carpeta assets
        },
        comments: [], // Array para comentarios
      });
    }
  }

  // Cargar más videos cuando el usuario hace scroll hacia abajo
  loadMore(event: any) {
    setTimeout(() => {
      const start = this.videos.length;
      const end = start + 5;

      // Cargar los siguientes 5 videos
      for (let i = start; i < end && i < this.totalVideos; i++) {
        this.videos.push({
          id: i + 1,
          url: `assets/videos/video${i + 1}.mp4`,
          liked: false,
          favorited: false,
          isPlaying: false,
          showComments: false,
          user: {
            name: `Usuario ${i + 1}`,
            photo: `assets/users/user${i + 1}.jpg`,
          },
          comments: [], // Array para comentarios
        });
      }

      // Detener el infinite scroll una vez que los videos se han cargado
      event.target.complete();

      // Si se cargaron todos los videos, deshabilitar el infinite scroll
      if (this.videos.length === this.totalVideos) {
        event.target.disabled = true;
      }
      setTimeout(() => {
        this.observeVideos();
      }, 1000);
    }, 1000);
  }

  // Función que maneja la visibilidad de los videos cuando se desplazan
  handleIntersection(entries: IntersectionObserverEntry[]) {
    entries.forEach((entry) => {
      const video: HTMLVideoElement = entry.target as HTMLVideoElement;

      // Extraer solo el nombre del archivo de la URL (por ejemplo, video1.mp4)
      const videoFileName = video.currentSrc.split('/').pop();

      // Buscar el video correspondiente en el array de videos basado en el nombre del archivo
      const videoData = this.videos.find(v => v.url.split('/').pop() === videoFileName);

      // Asegurarse de que videoData esté definido antes de intentar modificar sus propiedades
      if (videoData) {
        if (entry.isIntersecting) {
          // Si el video está visible y no está pausado manualmente, se reproduce
          if (!videoData.isPlaying) {
            video.play();
          }
        } else {
          // Si el video no es visible, se pausa
          video.pause();
          videoData.isPlaying = false; // Aseguramos que no quede en estado "playing"
        }
      } else {
        console.error('Video data no encontrado para el archivo:', videoFileName);
      }
    });
  }


  // Función para alternar entre pausar y reproducir el video cuando se toca
  togglePlayPause(videoElement: HTMLVideoElement, videoData: any) {
    if (videoElement.paused) {
      // Si el video está pausado, reproducirlo
      videoElement.play();
      videoData.isPlaying = true; // Cambiar el estado a "reproduciéndose"
    } else {
      // Si el video está reproduciéndose, pausarlo
      videoElement.pause();
      videoData.isPlaying = false; // Cambiar el estado a "pausado"
    }
  }

  // Función para dar like a un video
  async likeVideo(video: any) {
    video.liked = !video.liked; // Alternar el estado de "like"
    await this.presentToast(video.liked ? 'Like agregado' : 'Like eliminado'); // Mostrar el toast
  }

  // Función para agregar o eliminar de favoritos
  async saveToFavorites(video: any) {
    video.favorited = !video.favorited; // Alternar el estado de favorito
    await this.presentToast(video.favorited ? 'Añadido a favoritos' : 'Eliminado de favoritos'); // Mostrar el toast
  }

  // Funcion para ver comentarios
  async showComments(video: any) {
    video.showComments = !video.showComments;
  }

  // Funcion para comentar opciones
  async showCommentOptions(video: any) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Añadir Comentario',
      buttons: [
        {
          text: 'Muy bueno',
          handler: () => {
            this.addComment(video, 'Muy bueno');
          }
        },
        {
          text: 'Más o menos',
          handler: () => {
            this.addComment(video, 'Más o menos');
          }
        },
        {
          text: 'Malo',
          handler: () => {
            this.addComment(video, 'Malo');
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel',
          icon: 'close',
          handler: () => {
            console.log('Comentario cancelado');
          }
        }
      ]
    });
    await actionSheet.present();
  }

  //funcion que manda comentario hecho
  async addComment(video: any, comment: string) {
    video.comments.push(comment);
    video.showComments = false;
    await this.presentToast(`Comentario añadido: ${comment}`);
  }

  // Función para compartir un video (lógica de compartir no implementada aquí)
  async shareVideo() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Compartir',
      buttons: [
        {
          text: 'WhatsApp',
          icon: 'logo-whatsapp',
          handler: () => {
            this.presentToast('Compartido en WhatsApp');
          }
        },
        {
          text: 'Instagram',
          icon: 'logo-instagram',
          handler: () => {
            this.presentToast('Compartido en Instagram');
          }
        },
        {
          text: 'Facebook',
          icon: 'logo-facebook',
          handler: () => {
            this.presentToast('Compartido en Facebook');
          }
        },
        {
          text: 'Twitter',
          icon: 'logo-twitter',
          handler: () => {
            this.presentToast('Compartido en Twitter');
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel',
          icon: 'close',
          handler: () => {
            this.presentToast('Compartir cancelado');
          }
        }
      ]
    });
    await actionSheet.present();
  }

  // Función para mostrar un toast con un mensaje
  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message, // El mensaje que se muestra
      duration: 2000, // Duración del toast (2 segundos)
      position: 'top', // Posición del toast (arriba)
      color: 'light', // Color del toast
      cssClass: 'custom-toast', // Clase CSS personalizada para darle estilo
    });
    toast.present(); // Mostrar el toast
  }

  // Función para desplazar al video anterior
  scrollToPrevious() {
    const currentVideoIndex = this.getCurrentVideoIndex();
    if (currentVideoIndex > 0) {
      const previousVideo = document.getElementById('video-' + (currentVideoIndex - 1));
      if (previousVideo) {
        previousVideo.scrollIntoView({ behavior: 'smooth', block: 'start' }); // Desplazarse al video anterior
      }
    }
  }

  // Función para desplazarse al siguiente video
  scrollToNext() {
    const currentVideoIndex = this.getCurrentVideoIndex();
    if (currentVideoIndex < this.videos.length - 1) {
      const nextVideo = document.getElementById('video-' + (currentVideoIndex + 1));
      if (nextVideo) {
        nextVideo.scrollIntoView({ behavior: 'smooth', block: 'start' }); // Desplazarse al siguiente video
      }
    }
  }

  // Función para obtener el índice del video que está más cerca del centro de la pantalla
  getCurrentVideoIndex(): number {
    let closestVideoIndex = 0;
    let closestDistance = Infinity;

    // Recorre todos los videos y encuentra el que está más cerca del centro
    this.videoPlayers.forEach((videoPlayer, index) => {
      const rect = videoPlayer.nativeElement.getBoundingClientRect();
      const distanceFromCenter = Math.abs(rect.top + rect.height / 2 - window.innerHeight / 2);

      if (distanceFromCenter < closestDistance) {
        closestDistance = distanceFromCenter;
        closestVideoIndex = index;
      }
    });

    return closestVideoIndex; // Retorna el índice del video más cercano al centro
  }
  // Obtener el índice del video que está visible
  getActiveVideoIndex() {
    const videos = this.videoPlayers.toArray();
    const activeIndex = videos.findIndex((video) => {
      const rect = video.nativeElement.getBoundingClientRect();
      return rect.top >= 0 && rect.bottom <= window.innerHeight;
    });
    return activeIndex;
  }

}
