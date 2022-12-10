import { createIntervalCounter } from '@solid-primitives/timer';
import { Title } from 'solid-start';
import swag from '~/assets/swag.webp';
import swagnt from '~/assets/swagnt.webp';
import { AudioState, createAudio } from '@solid-primitives/audio';
import music from '~/assets/music.mp3';
import { Image, Stack } from 'solid-bootstrap';
import { Button, Modal } from 'solid-bootstrap';

function pad(n: number) {
  const padding = n > 9 ? '' : '0';
  return padding + n;
}

function secondsToHHMMSS(secs: number) {
  return (
    pad(Math.floor((secs / 3600) % 3600)) +
    ':' +
    pad(Math.floor((secs / 60) % 60)) +
    ':' +
    pad(secs % 60)
  );
}

export default function Home() {
  const [audio, controls] = createAudio(music);
  audio.player.loop = true;
  let isPlaybackRefused = $signal(false);
  const hasErrored = $(audio.state === AudioState.ERROR || isPlaybackRefused);
  const timeoutSource = $(hasErrored ? false : 1000);
  const seconds = $derefMemo(createIntervalCounter($get(timeoutSource)));
  const time = $(secondsToHHMMSS(seconds));
  const isSwaggy = $(time.includes('15'));
  const src = $(isSwaggy ? swag : swagnt);
  const title = $('Swag' + (isSwaggy ? '' : "n't"));

  async function tryPlaying() {
    try {
      await (controls.play as () => Promise<void>)();
      isPlaybackRefused = false;
    } catch {
      isPlaybackRefused = true;
    }
  }

  $mount(tryPlaying);

  return (
    <main>
      <Title>{title}</Title>
      <Modal
        show={hasErrored}
        onHide={tryPlaying}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton onHide={tryPlaying}>
          <Modal.Title as="h1" id="contained-modal-title-vcenter">
            Alert
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Press the button to continue</h4>
        </Modal.Body>
        <Modal.Footer>
          <Button type="button" onClick={tryPlaying}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      {!hasErrored && (
        <Stack class="position-absolute top-50 start-50 translate-middle col-10 col-md-4 mx-auto text-center">
          <Image src={src} fluid rounded />
          <h1>{time}</h1>
        </Stack>
      )}
    </main>
  );
}
