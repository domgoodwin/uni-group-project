export default class MusicPlayer {
    constructor(game){
        this.game = game;
        this.currentTrack = 0;
    }

    // Play the given music track
    playMusic(newMusic){
        this.game.sound.play(newMusic);
        this.currentTrack = newMusic;
    }

    // Stops all sounds
    stopMusic(){
        this.game.sound.stopAll();
    }

    // Stops all sounds and plays new music
    changeMusic(newMusic){
        this.stopMusic();
        this.playMusic(newMusic);
    }

    // Play new music if it's different to current music
    playMusicForRoom(newRoomJSON){
        if(newRoomJSON.music != this.currentTrack){
            this.changeMusic(newRoomJSON.music);
        }
    }
}