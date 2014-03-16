#include "../../main/include/crypt.h"


using namespace crypto;

int main() {
  std::cout << "Starting";

  crypto::Crypt* cipher = new crypto::Crypt();

  std::string ENCRYPT_PREFIX = "\nencrypted||||";

  std::string message = "encrypt this!";
  std::cout << "\nBefore encrypt: " + message;
  message = "encrypted||||" + cipher->encrypt(message);
  std::cout << "\nEncrypted: " + message;

  if (message.find(ENCRYPT_PREFIX) > 0) {
    std::cout << "\nBefore decrypt: " + message;
    message = cipher->decrypt(
        message.substr(
            message.find(ENCRYPT_PREFIX) + ENCRYPT_PREFIX.size()));
    std::cout << "\nDecrypted: " + message;
  } else {
    std::cout << "\nDidn't detect encryption: " + message;
    delete cipher;
    return 1;
  }

  std::cout << "\nExiting\n";
  delete cipher;

  return 0;
}

