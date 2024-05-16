<script>
  import Header from './Header.svelte';
  import Footer from './Footer.svelte';
  import { clipIt, isValidUrl, normalizeUrl } from './helpers';

  let urlInput = '';
  $: validUrl = isValidUrl(urlInput);
  let shortUrl;
  let errorMessage;

  const handleSubmit = () => {
    if (!urlInput) return;
    const normalizedUrl = normalizeUrl(urlInput);
    const body = {
      link: normalizedUrl,
    };
    const appUrl = `/.netlify/functions/create`;
    fetch(appUrl, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('-> success: ', data);
        shortUrl = data.link;
      })
      .catch((error) => {
        console.warn('-> Error: ', error);
      });
  };
</script>

<main>
  <Header />
  <section>
    <div class="text-banner">
      Tired of long and confusing urls? <code>ZIP⚡️</code>'em!
    </div>
    <article>
      <form on:submit|preventDefault={handleSubmit}>
        <input class="basic-input" bind:value={urlInput} />
        <button disabled={!validUrl || !urlInput} type="submit">
          ZIP⚡️
        </button>
      </form>
      {#if shortUrl}
        <div class="central-container">
          <input id="shortened" readonly value={shortUrl} />
          <div class="copy" on:click={() => clipIt('shortened')}>
            <div class="copy-icon">
              <span class="copy-frame"></span>
              <span class="copy-frame"></span>
            </div>
          </div>
        </div>
      {/if}
      {#if errorMessage}
        <div class="central-container">
          <div class="error-message">{errorMessage}</div>
        </div>
      {/if}
    </article>
  </section>
  <Footer />
</main>

<style>
  .central-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #0d0d0d;
  }
  #shortened {
    margin: 0 auto;
    text-align: center;
    padding: 1rem;
    width: 100%;
    font-size: 2.4em;
    font-weight: 300;
    background-color: transparent;
    border: none;
    border-bottom: 1px solid rgb(214, 214, 214);
    border-radius: 0px;
  }
  #shortened:focus {
    outline: none;
  }
  .copy {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 3rem auto;
    text-align: center;
    font-size: 3.6rem;
    cursor: pointer;
  }
  .copy-icon {
    position: relative;
    width: 6rem;
    height: 6rem;
    border-radius: 50%;
    background-color: #e0e0e0;
    box-shadow: 0 0 4px 2px #333333;
    transition: transform 180ms ease-in-out;
  }
  .copy-icon:active {
    transform: scale(0.9);
  }
  .copy-frame {
    position: absolute;
    width: 2.8rem;
    height: 3.6rem;
    border-radius: 4px;
  }
  .copy-frame:first-child {
    bottom: 0.8rem;
    right: 1.2rem;
    background-color: #e9e9e9;
    border: 2px solid #121212df;
  }
  .copy-frame:last-child {
    top: 0.8rem;
    left: 1.2rem;
    background-color: #ffffff;
    border: 2px solid #121212dc;
  }
</style>
