# Taquin Browser Extension

## Connected Sites Usage

### Connecting to site.

```javascript
window.tolar.enable();
```

### Sending transactions

Introduced method for sending transactions for approval to the extension.

```javascript
window.tolar.request({
  method: "taq_sendTransaction",
  params: [
    {
      sender_address: "5484c512b1cf3d45e7506a772b7358375acc571b2930d27deb",
      receiver_address: "54a42e22bb80ca05efe17e33a3b9ec16d31783840d1f397f6c",
      amount: 1,
      gas: 21000,
      gas_price: 1,
      data: "",
    },
  ],
});
```

### Other methods

`window.tolar.request()` can be used for invoking any gRPC method that is on safe list.
