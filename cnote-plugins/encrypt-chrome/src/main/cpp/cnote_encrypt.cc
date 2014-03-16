// Copyright (c) 2013 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/// @file cnote_encrypt.cc
/// This example demonstrates loading, running and scripting a very simple NaCl
/// module.  To load the NaCl module, the browser first looks for the
/// CreateModule() factory method (at the end of this file).  It calls
/// CreateModule() once to load the module code.  After the code is loaded,
/// CreateModule() is not called again.
///
/// Once the code is loaded, the browser calls the CreateInstance()
/// method on the object returned by CreateModule().  It calls CreateInstance()
/// each time it encounters an <embed> tag that references your NaCl module.
///
/// The browser can talk to your NaCl module via the postMessage() Javascript
/// function.  When you call postMessage() on your NaCl module from the browser,
/// this becomes a call to the HandleMessage() method of your pp::Instance
/// subclass.  You can send messages back to the browser by calling the
/// PostMessage() method on your pp::Instance.  Note that these two methods
/// (postMessage() in Javascript and PostMessage() in C++) are asynchronous.
/// This means they return immediately - there is no waiting for the message
/// to be handled.  This has implications in your program design, particularly
/// when mutating property values that are exposed to both the browser and the
/// NaCl module.

#include "ppapi/cpp/instance.h"
#include "ppapi/cpp/module.h"
#include "ppapi/cpp/var.h"
#include "../include/crypt.h"

using namespace std;
using namespace crypto;

// Globals
string ENCRYPT_PREFIX = "encrypted||||";
int ENCRYPT_PREFIX_LEN = ENCRYPT_PREFIX.size();

/// The Instance class.  One of these exists for each instance of your NaCl
/// module on the web page.  The browser will ask the Module object to create
/// a new Instance for each occurrence of the <embed> tag that has these
/// attributes:
///     src="cnote_encrypt.nmf"
///     type="application/x-pnacl"
/// To communicate with the browser, you must override HandleMessage() to
/// receive messages from the browser, and use PostMessage() to send messages
/// back to the browser.  Note that this interface is asynchronous.
class CnoteEncryptInstance: public pp::Instance {
public:
	/// The constructor creates the plugin-side instance.
	/// @param[in] instance the handle to the browser-side plugin instance.
	explicit CnoteEncryptInstance(PP_Instance instance) :
			pp::Instance(instance) {
	}

	virtual ~CnoteEncryptInstance() {
	}

	/// Handler for messages coming in from the browser via postMessage().  The
	/// @a var_message can contain be any pp:Var type; for example int, string
	/// Array or Dictionary. Please see the pp:Var documentation for more details.
	/// @param[in] var_message The message posted by the browser.
	virtual void HandleMessage(const pp::Var& var_message) {
		PostMessage(pp::Var("INFO: handle message."));

		if (!var_message.is_string()) {
			PostMessage(pp::Var("ERROR: unsupported message type received."));
			return;
		}

		try {
			PostMessage(pp::Var("INFO: creating cipher."));
			Crypt* cipher = new Crypt();
			PostMessage(pp::Var("INFO: created cipher."));

			if (cipher == NULL) {
				PostMessage(pp::Var("ERROR: failed to instantiate cipher!"));
			} else {
				string message(var_message.AsString());
				if (message.empty()) {
					PostMessage(pp::Var("INFO: detected empty message."));
				} else {
					int prefixPos = message.find_first_of(ENCRYPT_PREFIX);
					if (prefixPos == 0) {
						PostMessage(
								pp::Var("INFO: decrypting message " + message));
						int prefixLen = message.find_first_of(ENCRYPT_PREFIX)
								+ ENCRYPT_PREFIX_LEN;
						string decrypted = cipher->decrypt(
								message.substr(prefixLen));
						string info = "INFO: decrypted message " + decrypted;
						PostMessage(pp::Var(info));
						message = decrypted;
					} else {
						PostMessage(
								pp::Var("INFO: encrypting message " + message));
						string encrypted = ENCRYPT_PREFIX
								+ cipher->encrypt(message);
						PostMessage(pp::Var("INFO: encrypted message."));
						string info("INFO: encrypted message " + encrypted);
						PostMessage(pp::Var(info));
						message = encrypted;
					}

					if (cipher) {
						PostMessage(pp::Var("INFO: destroying cipher."));
						delete cipher;
						cipher = NULL;
						PostMessage(pp::Var("INFO: destroyed cipher."));
					}
				}

				string info("INFO: replying with message " + message);
				PostMessage(pp::Var(info));
				PostMessage(pp::Var(message));
			}
		} catch (const std::exception& ex) {
			string msg = "ERROR: exception occurred ";
			msg += ex.what();
			PostMessage(pp::Var(msg));
		} catch (const std::string& ex) {
			string msg = "ERROR: exception occurred ";
			msg += ex;
			PostMessage(pp::Var(msg));
		} catch (...) {
			PostMessage(pp::Var("ERROR: unknown error occurred."));
		}

		PostMessage(pp::Var("INFO: handled message."));
	}
};

/// The Module class.  The browser calls the CreateInstance() method to create
/// an instance of your NaCl module on the web page.  The browser creates a new
/// instance for each <embed> tag with type="application/x-pnacl".
class CnoteEncryptModule: public pp::Module {
public:
	CnoteEncryptModule() :
			pp::Module() {
	}
	virtual ~CnoteEncryptModule() {
	}

/// Create and return a CnoteEncryptInstance object.
/// @param[in] instance The browser-side instance.
/// @return the plugin-side instance.
	virtual pp::Instance* CreateInstance(PP_Instance instance) {
		return new CnoteEncryptInstance(instance);
	}
};

namespace pp {
/// Factory function called by the browser when the module is first loaded.
/// The browser keeps a singleton of this module.  It calls the
/// CreateInstance() method on the object you return to make instances.  There
/// is one instance per <embed> tag on the page.  This is the main binding
/// point for your NaCl module with the browser.
Module* CreateModule() {
	return new CnoteEncryptModule();
}
}  // namespace pp
